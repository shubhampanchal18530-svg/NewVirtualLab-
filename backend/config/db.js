import mongoose from "mongoose";
import dns from 'dns';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Ensure environment variables from backend/.env are loaded when this module runs
dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set in environment (.env)');
    }

    // Parse MongoDB URI to get hostname
    const uri = new URL(process.env.MONGO_URI);
    const hostname = uri.hostname;

    // Check DNS resolution first. For mongodb+srv URIs we must resolve SRV records.
    console.log('🔍 Verifying MongoDB DNS resolution...');
    try {
      if (process.env.MONGO_URI.startsWith('mongodb+srv://')) {
        const resolveSrv = promisify(dns.resolveSrv);
        const srvName = `_mongodb._tcp.${hostname}`;
        const records = await resolveSrv(srvName);
        if (!records || records.length === 0) {
          throw new Error('No SRV records returned');
        }
        console.log(`✅ SRV Resolution successful: ${srvName} -> ${records.map(r => r.name + ':' + r.port).join(', ')}`);
      } else {
        const lookup = promisify(dns.lookup);
        const { address } = await lookup(hostname);
        console.log(`✅ DNS Resolution successful: ${hostname} -> ${address}`);
      }
    } catch (dnsError) {
      console.error(`❌ DNS Resolution failed for ${hostname}:`, dnsError.message);
      throw new Error(`DNS lookup failed - check internet connection and MongoDB hostname`);
    }

    // Try MongoDB connection
    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Verify write permissions with a test
    console.log('🔒 Verifying database permissions...');
    try {
      // Try to create and immediately delete a test document
      const Test = mongoose.model('__test', new mongoose.Schema({ test: String }), '__test');
      const test = await Test.create({ test: 'test' });
      await Test.deleteOne({ _id: test._id });
      console.log('✅ Write permissions verified');
      
      // List available collections
      const collections = await conn.connection.db.listCollections().toArray();
      console.log(`📚 Available collections:`, collections.map(c => c.name));
    } catch (permError) {
      console.error('❌ Write permission test failed:', permError.message);
      throw new Error('Database write permission denied - check MongoDB Atlas access');
    }
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`, {
      name: error.name,
      message: error.message,
      code: error.code,
      // Check for specific MongoDB error codes
      isNetworkError: error.name === 'MongoNetworkError',
      isAuthError: error.name === 'MongoServerError' && error.code === 18,
      isTimeout: error.name === 'MongoTimeoutError'
    });

    if (error.name === 'MongoNetworkError') {
      console.error('🌐 Network Error: Check your internet connection and MongoDB Atlas IP whitelist');
    } else if (error.name === 'MongoServerError' && error.code === 18) {
      console.error('🔑 Authentication Error: Check your MongoDB username and password');
    } else if (error.name === 'MongoTimeoutError') {
      console.error('⏰ Timeout Error: MongoDB server took too long to respond');
    }

    console.warn('⚠️ Server running without DB connection - database features will not work');
  }
};

export default connectDB;
