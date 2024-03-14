import time
import unittest
import uuid
from app.models.user import User

class TestUser(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.user = User()

    def setUp(self):
        self.username = f'testuser_{uuid.uuid4()}'
        self.password = f'testpassword_{uuid.uuid4()}'
        self.user.create(self.username, self.password)

    def tearDown(self):
        self.user.remove_user(self.username)

    def test_a_create(self):
        start_time = time.time()
        # Test user creation
        new_username = f'testuser_{uuid.uuid4()}'
        new_password = f'testpassword_{uuid.uuid4()}'
        success, _ = self.user.create(new_username, new_password)
        self.assertTrue(success)

        # Test duplicate username
        success, msg = self.user.create(new_username, new_password)
        self.assertFalse(success)
        self.assertEqual(msg, 'Username is already taken')

        print(f"test_a_create performance: {time.time() - start_time} seconds")

    def test_b_validate(self):
        start_time = time.time()
        # Test valid user validation
        success, _ = self.user.validate(self.username, self.password)
        self.assertTrue(success)

        # Test invalid username
        success, msg = self.user.validate('nonexistent_user', self.password)
        self.assertFalse(success)
        self.assertEqual(msg, 'Username does not exist')

        # Test invalid password
        success, msg = self.user.validate(self.username, 'wrong_password')
        self.assertFalse(success)
        self.assertEqual(msg, 'Incorrect password')

        print(f"test_b_validate performance: {time.time() - start_time} seconds")

    def test_c_get_profile(self):
        start_time = time.time()
        profile = self.user.get_profile(self.username)
        self.assertIsNotNone(profile)
        self.assertEqual(profile['username'], self.username)
        self.assertIsNotNone(profile['registration_date'])
        self.assertIsNotNone(profile['game_played'])
        self.assertIsNotNone(profile['reward_points'])

        print(f"test_c_get_profile performance: {time.time() - start_time} seconds")

    def test_d_remove_user(self):
        start_time = time.time()
        # Test user removal
        success, _ = self.user.remove_user(self.username)
        self.assertTrue(success)

        # Test non-existent user removal
        success, msg = self.user.remove_user(self.username)
        self.assertFalse(success)
        self.assertEqual(msg, 'Failed to remove user')

        print(f"test_d_remove_user performance: {time.time() - start_time} seconds")


if __name__ == '__main__':
    unittest.main()
