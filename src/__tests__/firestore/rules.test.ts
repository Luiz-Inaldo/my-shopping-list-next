/**
 * @jest-environment node
 */
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

const ALICE_UID = 'alice-uid';
const BOB_UID = 'bob-uid';
const CHARLIE_UID = 'charlie-uid';

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'ezshoplist-test',
    firestore: {
      rules: readFileSync(resolve(__dirname, '../../../firestore.rules'), 'utf8'),
      host: 'localhost',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Security Rules', () => {
  describe('users collection', () => {
    test('users can read their own document', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'users', ALICE_UID), {
          uid: ALICE_UID,
          email: 'alice@example.com',
          name: 'Alice',
          role: 'user',
          premium: { status: false, expires_at: null },
          active: true,
        });
      });

      await assertSucceeds(getDoc(doc(aliceDb, 'users', ALICE_UID)));
    });

    test('users cannot read other users documents', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'users', ALICE_UID), {
          uid: ALICE_UID,
          email: 'alice@example.com',
          name: 'Alice',
          role: 'user',
          premium: { status: false, expires_at: null },
          active: true,
        });
      });

      await assertFails(getDoc(doc(bobDb, 'users', ALICE_UID)));
    });

    test('users can create their own document with role "user"', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();

      await assertSucceeds(
        setDoc(doc(aliceDb, 'users', ALICE_UID), {
          uid: ALICE_UID,
          email: 'alice@example.com',
          name: 'Alice',
          role: 'user',
          premium: { status: false, expires_at: null },
          profile_img: '',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    });

    test('users cannot create their own document with role "admin"', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();

      await assertFails(
        setDoc(doc(aliceDb, 'users', ALICE_UID), {
          uid: ALICE_UID,
          email: 'alice@example.com',
          name: 'Alice',
          role: 'admin',
          premium: { status: false, expires_at: null },
          profile_img: '',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    });

    test('users cannot set premium status to true on creation', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();

      await assertFails(
        setDoc(doc(aliceDb, 'users', ALICE_UID), {
          uid: ALICE_UID,
          email: 'alice@example.com',
          name: 'Alice',
          role: 'user',
          premium: { status: true, expires_at: null },
          profile_img: '',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    });

    test('users can update their profile fields', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'users', ALICE_UID), {
          uid: ALICE_UID,
          email: 'alice@example.com',
          name: 'Alice',
          role: 'user',
          premium: { status: false, expires_at: null },
          profile_img: '',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      await assertSucceeds(
        updateDoc(doc(aliceDb, 'users', ALICE_UID), {
          name: 'Alice Updated',
          profile_img: 'https://example.com/image.jpg',
          updatedAt: new Date(),
        })
      );
    });

    test('users cannot update their role or premium fields', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'users', ALICE_UID), {
          uid: ALICE_UID,
          email: 'alice@example.com',
          name: 'Alice',
          role: 'user',
          premium: { status: false, expires_at: null },
          profile_img: '',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      await assertFails(
        updateDoc(doc(aliceDb, 'users', ALICE_UID), {
          role: 'admin',
        })
      );

      await assertFails(
        updateDoc(doc(aliceDb, 'users', ALICE_UID), {
          premium: { status: true, expires_at: null },
        })
      );
    });
  });

  describe('purchases collection', () => {
    test('users can read their own purchases', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertSucceeds(getDoc(doc(aliceDb, 'purchases', 'purchase1')));
    });

    test('users can read purchases shared with them', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          shared_with: [BOB_UID],
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertSucceeds(getDoc(doc(bobDb, 'purchases', 'purchase1')));
    });

    test('users cannot read other users purchases', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertFails(getDoc(doc(bobDb, 'purchases', 'purchase1')));
    });

    test('users cannot read purchases not shared with them', async () => {
      const charlieDb = testEnv.authenticatedContext(CHARLIE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          shared_with: [BOB_UID],
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertFails(getDoc(doc(charlieDb, 'purchases', 'purchase1')));
    });

    test('users can create their own purchases', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();

      await assertSucceeds(
        addDoc(collection(aliceDb, 'purchases'), {
          user_id: ALICE_UID,
          title: 'My Shopping List',
          is_active: true,
          purchase_items: [],
          total_price: 0,
          start_date: new Date(),
        })
      );
    });

    test('users cannot create purchases for other users', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();

      await assertFails(
        addDoc(collection(bobDb, 'purchases'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          purchase_items: [],
          total_price: 0,
          start_date: new Date(),
        })
      );
    });

    test('purchase owners can update their purchases', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertSucceeds(
        updateDoc(doc(aliceDb, 'purchases', 'purchase1'), {
          title: 'Updated Shopping List',
          purchase_items: [{ id: '1', name: 'Item 1', checked: false }],
        })
      );
    });

    test('shared users can update purchase items', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          shared_with: [BOB_UID],
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertSucceeds(
        updateDoc(doc(bobDb, 'purchases', 'purchase1'), {
          purchase_items: [{ id: '1', name: 'Item 1', checked: false }],
        })
      );
    });

    test('users cannot change purchase owner', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertFails(
        updateDoc(doc(aliceDb, 'purchases', 'purchase1'), {
          user_id: BOB_UID,
        })
      );
    });

    test('shared users cannot modify shared_with field', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          shared_with: [BOB_UID],
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertFails(
        updateDoc(doc(bobDb, 'purchases', 'purchase1'), {
          shared_with: [BOB_UID, CHARLIE_UID],
        })
      );
    });

    test('purchase owners can delete their purchases', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertSucceeds(deleteDoc(doc(aliceDb, 'purchases', 'purchase1')));
    });

    test('shared users cannot delete purchases', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'purchases', 'purchase1'), {
          user_id: ALICE_UID,
          title: 'Alice Shopping List',
          is_active: true,
          shared_with: [BOB_UID],
          purchase_items: [],
          total_price: 0,
        });
      });

      await assertFails(deleteDoc(doc(bobDb, 'purchases', 'purchase1')));
    });
  });

  describe('usernames collection', () => {
    test('anyone can check username availability', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'usernames', 'alice'), {
          uuid: ALICE_UID,
        });
      });

      await assertSucceeds(getDoc(doc(unauthDb, 'usernames', 'alice')));
    });

    test('users can create username with their uid', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();

      await assertSucceeds(
        setDoc(doc(aliceDb, 'usernames', 'alice'), {
          uuid: ALICE_UID,
        })
      );
    });

    test('users cannot create username with another users uid', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();

      await assertFails(
        setDoc(doc(bobDb, 'usernames', 'alice'), {
          uuid: ALICE_UID,
        })
      );
    });

    test('users can delete their own username', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'usernames', 'alice'), {
          uuid: ALICE_UID,
        });
      });

      await assertSucceeds(deleteDoc(doc(aliceDb, 'usernames', 'alice')));
    });

    test('users cannot delete other users usernames', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'usernames', 'alice'), {
          uuid: ALICE_UID,
        });
      });

      await assertFails(deleteDoc(doc(bobDb, 'usernames', 'alice')));
    });
  });

  describe('agent_tokens collection (future)', () => {
    test('users cannot read agent tokens', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'agent_tokens', 'token1'), {
          user_id: ALICE_UID,
          name: 'My Token',
        });
      });

      await assertFails(getDoc(doc(aliceDb, 'agent_tokens', 'token1')));
    });

    test('users cannot write agent tokens', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();

      await assertFails(
        setDoc(doc(aliceDb, 'agent_tokens', 'token1'), {
          user_id: ALICE_UID,
          name: 'My Token',
        })
      );
    });
  });

  describe('notifications collection', () => {
    test('users can create notifications if sender_info.id matches auth.uid', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      const notification = {
        body: 'Test notification',
        created_at: Timestamp.now(),
        is_read: false,
        metadata: { purchase_id: 'purchase123' },
        sender_info: {
          id: ALICE_UID,
          name: 'Alice',
          profile_img: 'https://example.com/alice.jpg',
        },
        target_id: BOB_UID,
        title: 'Test Title',
      };

      await assertSucceeds(addDoc(collection(aliceDb, 'notifications'), notification));
    });

    test('users cannot create notifications if sender_info.id does not match auth.uid', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      const notification = {
        body: 'Test notification',
        created_at: Timestamp.now(),
        is_read: false,
        metadata: { purchase_id: 'purchase123' },
        sender_info: {
          id: BOB_UID, // Different from auth.uid
          name: 'Bob',
          profile_img: 'https://example.com/bob.jpg',
        },
        target_id: BOB_UID,
        title: 'Test Title',
      };

      await assertFails(addDoc(collection(aliceDb, 'notifications'), notification));
    });

    test('users cannot create notifications if required fields are missing', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      const notification = {
        body: 'Test notification',
        sender_info: {
          id: ALICE_UID,
          name: 'Alice',
          profile_img: 'https://example.com/alice.jpg',
        },
        target_id: BOB_UID,
        // Missing: created_at, is_read, metadata, title
      };

      await assertFails(addDoc(collection(aliceDb, 'notifications'), notification));
    });

    test('users cannot create notifications if sender_info is incomplete', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      const notification = {
        body: 'Test notification',
        created_at: Timestamp.now(),
        is_read: false,
        metadata: { purchase_id: 'purchase123' },
        sender_info: {
          id: ALICE_UID,
          // Missing: name, profile_img
        },
        target_id: BOB_UID,
        title: 'Test Title',
      };

      await assertFails(addDoc(collection(aliceDb, 'notifications'), notification));
    });

    test('users can read their own notifications', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'notifications', 'notif1'), {
          body: 'Test',
          created_at: Timestamp.now(),
          is_read: false,
          metadata: {},
          sender_info: { id: ALICE_UID, name: 'Alice', profile_img: '' },
          target_id: BOB_UID,
          title: 'Test',
        });
      });

      await assertSucceeds(getDoc(doc(bobDb, 'notifications', 'notif1')));
    });

    test('users cannot read notifications not targeted to them', async () => {
      const aliceDb = testEnv.authenticatedContext(ALICE_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'notifications', 'notif1'), {
          body: 'Test',
          created_at: Timestamp.now(),
          is_read: false,
          metadata: {},
          sender_info: { id: ALICE_UID, name: 'Alice', profile_img: '' },
          target_id: BOB_UID, // Different user
          title: 'Test',
        });
      });

      await assertFails(getDoc(doc(aliceDb, 'notifications', 'notif1')));
    });

    test('users can update their own notifications', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'notifications', 'notif1'), {
          body: 'Test',
          created_at: Timestamp.now(),
          is_read: false,
          metadata: {},
          sender_info: { id: ALICE_UID, name: 'Alice', profile_img: '' },
          target_id: BOB_UID,
          title: 'Test',
        });
      });

      await assertSucceeds(updateDoc(doc(bobDb, 'notifications', 'notif1'), { is_read: true }));
    });

    test('users can delete their own notifications', async () => {
      const bobDb = testEnv.authenticatedContext(BOB_UID).firestore();
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'notifications', 'notif1'), {
          body: 'Test',
          created_at: Timestamp.now(),
          is_read: false,
          metadata: {},
          sender_info: { id: ALICE_UID, name: 'Alice', profile_img: '' },
          target_id: BOB_UID,
          title: 'Test',
        });
      });

      await assertSucceeds(deleteDoc(doc(bobDb, 'notifications', 'notif1')));
    });
  });
});
