const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const dbFilePath = path.join(__dirname, "..", "local_db.json");

function setupMockDb() {
  console.log(`[MockDB] Initializing local JSON database at: ${dbFilePath}`);
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify({
      users: [],
      roadmaps: [],
      githubanalyses: [],
      resumeanalyses: [],
      skillgaps: [],
      jobmatches: []
    }, null, 2));
  }

  const keyMap = {
    'User': 'users',
    'Roadmap': 'roadmaps',
    'GithubAnalysis': 'githubanalyses',
    'ResumeAnalysis': 'resumeanalyses',
    'SkillGap': 'skillgaps',
    'JobMatch': 'jobmatches'
  };

  const getCollection = (modelName) => {
    try {
      const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
      const key = keyMap[modelName] || (modelName.toLowerCase() + 's');
      if (!data[key]) data[key] = [];
      return data[key];
    } catch (e) {
      return [];
    }
  };

  const saveCollection = (modelName, collection) => {
    try {
      const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
      const key = keyMap[modelName] || (modelName.toLowerCase() + 's');
      data[key] = collection;
      fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("[MockDB] Failed to save collection:", e.message);
    }
  };

  const applyOverrides = (target) => {
    // Mock Model.create
    target.create = async function(doc) {
      const collection = getCollection(this.modelName);
      const newDoc = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...doc,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      newDoc.save = async function() {
        const col = getCollection(this.modelName);
        const index = col.findIndex(item => String(item._id) === String(newDoc._id));
        if (index !== -1) {
          newDoc.updatedAt = new Date();
          col[index] = { ...col[index], ...newDoc };
          saveCollection(this.modelName, col);
        }
        return newDoc;
      };

      collection.push(newDoc);
      saveCollection(this.modelName, collection);
      return newDoc;
    };

    // Mock Model.find
    target.find = function(query = {}) {
      const collection = getCollection(this.modelName);
      let results = [...collection];
      
      if (query && typeof query === 'object') {
        results = collection.filter(item => {
          return Object.keys(query).every(key => {
            if (query[key] && typeof query[key] === 'object') return true; // skip operators
            return String(item[key]) === String(query[key]);
          });
        });
      }

      const chain = {
        sort: () => chain,
        exec: async () => results,
        then: (cb) => Promise.resolve(results).then(cb)
      };
      return chain;
    };

    // Mock Model.findOne
    target.findOne = function(query = {}) {
      const collection = getCollection(this.modelName);
      let result = null;

      if (query && typeof query === 'object') {
        result = collection.find(item => {
          return Object.keys(query).every(key => {
            if (query[key] && typeof query[key] === 'object') return true; // skip operators
            return String(item[key]) === String(query[key]);
          });
        });
      }

      if (result) {
        result.save = async function() {
          const col = getCollection(target.modelName);
          const index = col.findIndex(item => String(item._id) === String(result._id));
          if (index !== -1) {
            result.updatedAt = new Date();
            col[index] = { ...col[index], ...result };
            saveCollection(target.modelName, col);
          }
          return result;
        };
      }

      const chain = {
        sort: () => chain,
        exec: async () => result,
        then: (cb) => Promise.resolve(result).then(cb)
      };
      return chain;
    };

    // Mock Model.findById
    target.findById = function(id) {
      const collection = getCollection(this.modelName);
      const result = collection.find(item => String(item._id) === String(id));
      
      if (result) {
        result.save = async function() {
          const col = getCollection(target.modelName);
          const index = col.findIndex(item => String(item._id) === String(result._id));
          if (index !== -1) {
            result.updatedAt = new Date();
            col[index] = { ...col[index], ...result };
            saveCollection(target.modelName, col);
          }
          return result;
        };
      }

      const chain = {
        exec: async () => result,
        then: (cb) => Promise.resolve(result).then(cb)
      };
      return chain;
    };

    // Mock Model.deleteOne
    target.deleteOne = async function(query = {}) {
      const collection = getCollection(this.modelName);
      const initialLen = collection.length;
      const filtered = collection.filter(item => {
        return !Object.keys(query).every(key => {
          return String(item[key]) === String(query[key]);
        });
      });
      saveCollection(this.modelName, filtered);
      return { deletedCount: initialLen - filtered.length };
    };

    // Mock Model.deleteMany
    target.deleteMany = async function(query = {}) {
      const collection = getCollection(this.modelName);
      const initialLen = collection.length;
      const filtered = collection.filter(item => {
        return !Object.keys(query).every(key => {
          return String(item[key]) === String(query[key]);
        });
      });
      saveCollection(this.modelName, filtered);
      return { deletedCount: initialLen - filtered.length };
    };

    // Mock Model.insertMany
    target.insertMany = async function(docs) {
      if (!Array.isArray(docs)) docs = [docs];
      const collection = getCollection(this.modelName);
      const newDocs = docs.map(doc => ({
        _id: new mongoose.Types.ObjectId().toString(),
        ...doc,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      collection.push(...newDocs);
      saveCollection(this.modelName, collection);
      return newDocs;
    };
  };

  // Apply to mongoose.Model prototype/statics
  applyOverrides(mongoose.Model);

  // Apply to already compiled models
  const compiledModels = Object.values(mongoose.models);
  console.log(`[MockDB] Applying mock overrides to ${compiledModels.length} compiled models: ${compiledModels.map(m => m.modelName).join(', ')}`);
  for (const model of compiledModels) {
    applyOverrides(model);
  }
}

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log("Using Mock DB JSON fallback mode.");
    setupMockDb();
  }
};

module.exports = connectDB;
