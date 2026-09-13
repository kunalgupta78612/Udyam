import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PendingScheme from '../models/PendingScheme.js';
import Scheme from '../models/Scheme.js';
import {
  getPendingSchemes,
  getPendingSchemeById,
  updatePendingScheme,
  approvePendingScheme,
  deletePendingScheme
} from '../controllers/adminController.js';

dotenv.config();

describe('Step 14: Pending Scheme Review Queue Tests', () => {
  let createdPendingIds = [];
  let createdSchemeIds = [];

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/udyam');
    }
  });

  after(async () => {
    // Clean up test data
    if (createdPendingIds.length > 0) {
      await PendingScheme.deleteMany({ _id: { $in: createdPendingIds } });
    }
    if (createdSchemeIds.length > 0) {
      await Scheme.deleteMany({ _id: { $in: createdSchemeIds } });
    }
    await mongoose.disconnect();
  });

  describe('PendingScheme Model Validation', () => {
    it('should fail validation when required fields are missing', async () => {
      const pending = new PendingScheme({});
      let err;
      try {
        await pending.validate();
      } catch (e) {
        err = e;
      }
      assert.ok(err, 'Should throw validation error');
      assert.ok(err.errors.name, 'Name is required');
      assert.ok(err.errors.sponsoringBody, 'Sponsoring body is required');
      assert.ok(err.errors.description, 'Description is required');
      assert.ok(err.errors.benefits, 'Benefits is required');
      assert.ok(err.errors.sourceUrl, 'Source URL is required');
    });

    it('should assign correct default values on PendingScheme', async () => {
      const doc = new PendingScheme({
        name: 'Test Default Pending Scheme',
        sponsoringBody: 'Ministry of MSME',
        description: 'Testing default values',
        benefits: { type: 'subsidy', description: '20% subsidy' },
        sourceUrl: 'https://msme.gov.in/test'
      });

      assert.strictEqual(doc.status, 'pending');
      assert.strictEqual(doc.level, 'central');
      assert.strictEqual(doc.state, null);
      assert.strictEqual(doc.reviewedBy, null);
      assert.strictEqual(doc.approvedScheme, null);
      assert.deepStrictEqual(doc.eligibilityRules, []);
      assert.deepStrictEqual(doc.documentsRequired, []);
    });

    it('should reject invalid status values', async () => {
      const doc = new PendingScheme({
        name: 'Invalid Status Test',
        sponsoringBody: 'Test Body',
        description: 'Test description',
        benefits: { type: 'grant', description: 'Grant' },
        sourceUrl: 'https://test.gov.in',
        status: 'archived_invalid'
      });

      let err;
      try {
        await doc.validate();
      } catch (e) {
        err = e;
      }
      assert.ok(err);
      assert.ok(err.errors.status, 'Should reject status not in [pending, approved, rejected]');
    });
  });

  describe('Admin Review Queue Controller Operations', () => {
    let testPendingDoc;

    it('should create and store a pending scheme document', async () => {
      testPendingDoc = await PendingScheme.create({
        name: 'Automated Test Scraped Scheme ' + Date.now(),
        nameHi: 'स्वचालित परीक्षण योजना',
        sponsoringBody: 'Ministry of Skill Development',
        level: 'central',
        description: 'Scraped and parsed raw scheme awaiting verification.',
        eligibilityRules: [
          {
            field: 'age',
            operator: 'between',
            value: [18, 35],
            ruleType: 'hard',
            label: 'Age between 18 and 35'
          }
        ],
        benefits: {
          type: 'training',
          description: 'Free skill training stipend'
        },
        documentsRequired: [{ name: 'Aadhaar', mandatory: true }],
        sourceUrl: 'https://msde.gov.in/schemes/skill-test',
        status: 'pending',
        rawScrapedContent: {
          title: 'Skill Test Scheme',
          cleanText: 'Raw scraped snippet...',
          scrapedAt: new Date().toISOString()
        }
      });

      createdPendingIds.push(testPendingDoc._id);
      assert.ok(testPendingDoc._id);
      assert.strictEqual(testPendingDoc.status, 'pending');
    });

    it('GET /api/admin/pending - should list pending schemes', async () => {
      const req = { query: { status: 'pending' } };
      let responseData = null;
      let statusCode = null;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              responseData = data;
            }
          };
        }
      };

      await getPendingSchemes(req, res, (err) => assert.fail(err));

      assert.strictEqual(statusCode, 200);
      assert.strictEqual(responseData.success, true);
      assert.ok(Array.isArray(responseData.pendingSchemes));
      const found = responseData.pendingSchemes.find(
        (p) => p._id.toString() === testPendingDoc._id.toString()
      );
      assert.ok(found, 'Should contain the newly created pending scheme');
    });

    it('GET /api/admin/pending/:id - should fetch a single pending scheme', async () => {
      const req = { params: { id: testPendingDoc._id.toString() } };
      let responseData = null;
      let statusCode = null;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              responseData = data;
            }
          };
        }
      };

      await getPendingSchemeById(req, res, (err) => assert.fail(err));

      assert.strictEqual(statusCode, 200);
      assert.strictEqual(responseData.success, true);
      assert.strictEqual(responseData.pendingScheme.name, testPendingDoc.name);
    });

    it('PUT /api/admin/pending/:id - should update scheme fields during review', async () => {
      const req = {
        params: { id: testPendingDoc._id.toString() },
        body: {
          name: testPendingDoc.name + ' (Reviewed)',
          reviewNotes: 'Verified all eligibility rules with official gazette notification.'
        }
      };
      let responseData = null;
      let statusCode = null;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              responseData = data;
            }
          };
        }
      };

      await updatePendingScheme(req, res, (err) => assert.fail(err));

      assert.strictEqual(statusCode, 200);
      assert.strictEqual(responseData.success, true);
      assert.ok(responseData.pendingScheme.name.endsWith('(Reviewed)'));
      assert.strictEqual(
        responseData.pendingScheme.reviewNotes,
        'Verified all eligibility rules with official gazette notification.'
      );
    });

    it('POST /api/admin/pending/:id/approve - should approve and move to active Scheme collection', async () => {
      const fakeAdminId = new mongoose.Types.ObjectId();
      const req = {
        params: { id: testPendingDoc._id.toString() },
        user: { _id: fakeAdminId }
      };
      let responseData = null;
      let statusCode = null;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              responseData = data;
            }
          };
        }
      };

      await approvePendingScheme(req, res, (err) => assert.fail(err));

      assert.strictEqual(statusCode, 201);
      assert.strictEqual(responseData.success, true);
      assert.ok(responseData.scheme);
      createdSchemeIds.push(responseData.scheme._id);

      // Verify active Scheme properties
      assert.strictEqual(responseData.scheme.isActive, true);
      assert.strictEqual(responseData.scheme.version, 1);
      assert.strictEqual(responseData.scheme.name, testPendingDoc.name + ' (Reviewed)');

      // Verify pendingScheme state updated
      assert.strictEqual(responseData.pendingScheme.status, 'approved');
      assert.strictEqual(
        responseData.pendingScheme.approvedScheme.toString(),
        responseData.scheme._id.toString()
      );
      assert.strictEqual(
        responseData.pendingScheme.reviewedBy.toString(),
        fakeAdminId.toString()
      );
      assert.ok(responseData.pendingScheme.reviewedAt);

      // Verify live query on Scheme collection
      const liveScheme = await Scheme.findById(responseData.scheme._id);
      assert.ok(liveScheme);
      assert.strictEqual(liveScheme.name, testPendingDoc.name + ' (Reviewed)');
    });

    it('POST /api/admin/pending/:id/approve - should reject re-approval of already approved scheme', async () => {
      const req = {
        params: { id: testPendingDoc._id.toString() },
        user: { _id: new mongoose.Types.ObjectId() }
      };
      let responseData = null;
      let statusCode = null;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              responseData = data;
            }
          };
        }
      };

      await approvePendingScheme(req, res, (err) => assert.fail(err));

      assert.strictEqual(statusCode, 400);
      assert.strictEqual(responseData.success, false);
      assert.match(responseData.message, /already been approved/i);
    });

    it('DELETE /api/admin/pending/:id - should delete/discard a pending scheme', async () => {
      // Create temporary pending scheme to delete
      const tempDoc = await PendingScheme.create({
        name: 'Temp To Delete ' + Date.now(),
        sponsoringBody: 'Department of Test',
        description: 'To be discarded',
        benefits: { type: 'grant', description: 'Test grant' },
        sourceUrl: 'https://test.gov.in/discard'
      });

      const req = { params: { id: tempDoc._id.toString() } };
      let responseData = null;
      let statusCode = null;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              responseData = data;
            }
          };
        }
      };

      await deletePendingScheme(req, res, (err) => assert.fail(err));

      assert.strictEqual(statusCode, 200);
      assert.strictEqual(responseData.success, true);
      assert.strictEqual(responseData.message, 'Pending scheme discarded.');

      // Ensure it's deleted from database
      const checkDoc = await PendingScheme.findById(tempDoc._id);
      assert.strictEqual(checkDoc, null);
    });
  });
});
