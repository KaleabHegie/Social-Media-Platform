const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const { faker } = require("@faker-js/faker");

const BASE_URL = "http://localhost:5000/api";
const PASSWORD = "P@ssword1";


const ETHIOPIAN_NAMES = [
  "Abebe",
  "Addis",
  "Amanuel",
  "Bethel",
  "Binyam",
  "Biruk",
  "Daniel",
  "Desta",
  "Elias",
  "Eyob",
  "Frehiwot",
  "Genet",
  "Haile",
  "Hana",
  "Hirut",
  "Kebede",
  "Lidya",
  "Marta",
  "Mulu",
  "Mekdes",
  "Mulugeta",
  "Negash",
  "Netsanet",
  "Samuel",
  "Selam",
  "Tadesse",
  "Tigist",
  "Yared",
  "Yemisirach",
  "Zewdu",
  "Zelalem",
  "Mahedere"
];

const HASHTAGS = [
  "#technology", "#life", "#food", "#travel", "#fashion", "#fitness", "#music", "#art", "#love", "#family", "#happiness", "#adventure", "#nature", "#photography", "#motivation"
];
const CAPTIONS = [
  "Enjoying the moment!", "Life is beautiful.", "Creating memories.", "Chasing dreams.", "Living my best life!", "Grateful for today.", "The best is yet to come.", "Feeling blessed!", "Every day is a new opportunity.", "Stay positive, work hard, make it happen."
];

const PROFILE_PICS_DIR = "./Pop/profilePics";
// Folder for post images
const POSTS_DIR = './Pop/posts'; // Define the path for the posts images folder

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 5); // Generates a 3-character random string
};

const register = async (numUsers) => {
  const registeredUsers = [];

  for (let i = 0; i < numUsers; i++) {
    const firstName = ETHIOPIAN_NAMES[Math.floor(Math.random() * ETHIOPIAN_NAMES.length)];
    const lastName = ETHIOPIAN_NAMES[Math.floor(Math.random() * ETHIOPIAN_NAMES.length)];
    const userName = `${firstName}${i + 1}${generateRandomString()}`;
    const email = `${userName}@example.com`;
    const gender = Math.random() > 0.5 ? "male" : "female";

    const userData = {
      first_name: firstName,
      last_name: lastName,
      user_name: userName,
      email: email,
      gender: gender,
      password: PASSWORD,
    };

    try {
      const response = await axios.post(`${BASE_URL}/register`, userData);
      registeredUsers.push(response.data); // Push the newly registered user data
      console.log(`User ${userName} registered successfully.`);
    } catch (error) {
      console.error(`Error registering user ${userName}:`, error);
    }
  }

  return registeredUsers;
};

console.log("Hello");

// Example usage:
// register(5); // Register 5 users

///----------------------------------------------------------------

// Login and get bearer token for a given user
const login = async (userName) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      username: userName,
      password: PASSWORD,
    });
    return response.data.accessToken;
  } catch (error) {
    console.error(`Error logging in user ${userName}:`, error.message);
    return null;
  }
};

// Fetch users from the API using the bearer token
const fetchUsers = async (bearerToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/searchUsers`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    return response.data.users;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }
};

// Set profile picture, bio, and follow random users for a given user
const setProfilePictureAndBio = async (user, adminToken) => {
  const userToken = await login(user.user_name);
  if (!userToken) return;

  try {
    // Set profile picture
    const profilePicFile =
      fs.readdirSync(PROFILE_PICS_DIR)[
      Math.floor(Math.random() * fs.readdirSync(PROFILE_PICS_DIR).length)
      ];
    const profilePicPath = path.join(PROFILE_PICS_DIR, profilePicFile);
    const form = new FormData();
    form.append("profileImg", fs.createReadStream(profilePicPath));

    try {
      const profileResponse = await axios.post(`${BASE_URL}/setProfileImage`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(`Profile picture updated for ${user.user_name}`);
    } catch (error) {
      console.error(
        `Error setting profile picture for ${user.user_name}:`,
        error.response?.data?.message || error.message,
        error.response?.data || error
      );
    }

    // Set bio
    const bio = faker.lorem.sentence();
    try {
      const bioResponse = await axios.post(
        `${BASE_URL}/setBio`,
        { bio },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(`Bio updated for ${user.user_name}`);
    } catch (error) {
      console.error(
        `Error setting bio for ${user.user_name}:`,
        error.response?.data?.message || error.message,
        error.response?.data || error
      );
    }
    // Follow random users
    const usersToFollow = await fetchUsers(adminToken);

    // Determine a random number of users to follow (e.g., between 1 and 5 or total users available)
    const followCount = Math.min(
      Math.floor(Math.random() * 41) + 40, // Random number between 40 and 41
      usersToFollow.length // Ensure it doesn't exceed available users
    );

    // Shuffle the users list and take the first `followCount` users
    const randomUsersToFollow = usersToFollow
      .sort(() => 0.5 - Math.random())
      .slice(0, followCount);

    for (const randomUser of randomUsersToFollow) {
      try {
        const followResponse = await axios.post(
          `${BASE_URL}/followUser`,
          { userId: randomUser.id }, // Pass userId in the body
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log(`Followed ${randomUser.user_name}`);
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(
            `Error following ${randomUser.user_name}: ${error.response.data.message}`
          );
        } else {
          console.error(`Error following ${randomUser.user_name}: ${error.message}`);
        }
      }
    }
    console.log("-----------------------------------------------\n\n");
  } catch (error) {
    console.error(
      `Error updating profile for ${user.user_name}:`,
      error.response?.data?.message || error.message,
      error.response?.data || error
    );
  }
};

// Main function to process users
const bringUsersToLifeee = async (numUsers) => {
  const adminToken = await login("user1"); // Log in as user1 for admin access
  if (!adminToken) {
    console.error("Failed to log in as user1");
    return;
  }


  const users = await fetchUsers(adminToken);
  if (numUsers == 0) {
    users.length
  }
  const usersToProcess = users.slice(0, numUsers);

  for (let user of usersToProcess) {
    await setProfilePictureAndBio(user, adminToken);
  }
};

// Example: Process the first 5 users





// Function to get random files from the posts directory
const getRandomPostFiles = () => {
  const files = fs.readdirSync(POSTS_DIR);
  const numFiles = Math.floor(Math.random() * 4) + 1; // Randomize file count (1 to 4)
  const randomFiles = [];

  for (let i = 0; i < numFiles; i++) {
    const randomFile = files[Math.floor(Math.random() * files.length)];
    randomFiles.push(path.join(POSTS_DIR, randomFile));
  }

  return randomFiles;
};




// Function to upload posts for each user
const populateWithPosts = async (numUsers) => {
  const adminToken = await login("user1"); // Log in as user1 for admin access
  if (!adminToken) {
    console.error("Failed to log in as user1");
    return;
  }

  const users = await fetchUsers(adminToken);
  if (numUsers === 0) {
    numUsers = users.length;
  }

  const usersToProcess = users.slice(0, numUsers);

  for (let user of usersToProcess) {
    const userToken = await login(user.user_name);
    if (!userToken) {
      console.error(`Failed to log in as ${user.user_name}`);
      continue;
    }

    const postsCount = Math.floor(Math.random() * 5) + 1; // Random number of posts (1-5)

    for (let i = 0; i < postsCount; i++) {
      const getRandomCaptions = () => {
        const numCaptions = Math.floor(Math.random() * 10) + 1; // Randomize number of captions (1 to all captions)
        const randomCaptions = [];

        for (let i = 0; i < numCaptions; i++) {
          randomCaptions.push(CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)]);
        }

        return randomCaptions.join(' '); // Concatenate captions with a space separator
      };

      try {
        const form = new FormData();
        const caption = getRandomCaptions();
        const type = Math.random() > 0.8 ? "post" : "story"; // Random type: post or story
        const rawHashtags = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () =>
          HASHTAGS[Math.floor(Math.random() * HASHTAGS.length)]
        ).join(' '); // Random hashtags

        const postFiles = getRandomPostFiles();

        postFiles.forEach((file, index) => {
          form.append('files', fs.createReadStream(file), `file${index + 1}`);
        });

        // Add caption, type, and hashtags to the form
        form.append('caption', caption);
        form.append('type', type);
        form.append('rawHashtags', rawHashtags);

        // Upload post
        const uploadResponse = await axios.post(`${BASE_URL}/uploadPost`, form, {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (uploadResponse.status === 200) {
          console.log(`Post uploaded for ${user.user_name}`);
        } else {
          console.log(`Error uploading post for ${user.user_name}: ${uploadResponse.data.message}`);
        }
      } catch (error) {
        console.error(`Error uploading post for ${user.user_name}:`, error.message);
      }
    }
  }
};

// like posts
const likePosts = async (numUsers) => {
  const adminToken = await login("user1"); // Log in as admin
  if (!adminToken) {
    console.error("Failed to log in as admin.");
    return;
  }

  const users = await fetchUsers(adminToken);
  if (numUsers === 0) numUsers = users.length;

  const usersToProcess = users.slice(0, numUsers);

  for (let user of usersToProcess) {
    const userToken = await login(user.user_name);
    if (!userToken) {
      console.error(`Failed to log in as ${user.user_name}`);
      continue;
    }

    try {
      const postsResponse = await axios.get(`${BASE_URL}/getHomeFeed`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      const posts = postsResponse.data.posts;

      // Log the posts data to see its structure
      console.log(`Fetched posts for ${user.user_name}:`, posts);

      // Ensure the posts array is not empty and contains valid post objects with an _id
      if (!posts || posts.length === 0) {
        console.error(`No posts found for ${user.user_name}`);
        continue;
      }

      // Randomize the number of likes and select posts
      const likeCount = Math.floor(Math.random() * 41) + 40; // Randomize likes (40-80)
      const randomPosts = posts.sort(() => 0.5 - Math.random()).slice(0, likeCount);

      for (const post of randomPosts) {
        // Ensure the post has a valid _id before liking it
        if (!post._id) {
          console.error(`Post is missing an _id:`, post);
          continue; // Skip this post if it doesn't have a valid _id
        }

        try {
          await axios.post(
            `${BASE_URL}/likePost`,
            { postId: post._id }, // Use _id instead of id
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          console.log(`${user.user_name} liked post ${post._id}`);
        } catch (error) {
          console.error(
            `Error: ${user.user_name} could not like post ${post._id}.`,
            error.response?.data?.message || error.message
          );
        }
      }
    } catch (error) {
      console.error(`Error fetching posts for ${user.user_name}:`, error.message);
    }
  }
};
//add comment
const addComments = async (numUsers) => {
  const adminToken = await login("user1"); // Log in as admin
  if (!adminToken) {
    console.error("Failed to log in as admin.");
    return;
  }

  const users = await fetchUsers(adminToken);
  if (numUsers === 0) numUsers = users.length;

  const usersToProcess = users.slice(0, numUsers);

  for (let user of usersToProcess) {
    const userToken = await login(user.user_name);
    if (!userToken) {
      console.error(`Failed to log in as ${user.user_name}`);
      continue;
    }

    try {
      const postsResponse = await axios.get(`${BASE_URL}/getHomeFeed`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      const posts = postsResponse.data.posts;
      const commentCount = Math.floor(Math.random() * 41) + 40; // Randomize comments (40-80)
      const randomPosts = posts.sort(() => 0.5 - Math.random()).slice(0, commentCount);

      for (const post of randomPosts) {
        // Validate postId
        if (!post._id) {
          console.error(`Post is missing an _id:`, post);
          continue;
        }

        const commentText = faker.lorem.sentence(); // Generate random content
        if (!commentText.trim()) {
          console.error(`Generated comment is empty, skipping post ${post._id}`);
          continue;
        }

        try {
          // Send the API request to make a comment
          const response = await axios.post(
            `${BASE_URL}/makeComment`,
            {
              postId: post._id, // Correctly send post._id as postId
              content: commentText, // Send comment text as "content"
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          console.log(`${user.user_name} commented on post ${post._id}: "${commentText}"`);
        } catch (error) {
          console.error(
            `Error: ${user.user_name} could not comment on post ${post._id}.`,
            error.response?.data?.message || error.message
          );
        }
      }
    } catch (error) {
      console.error(`Error fetching posts for ${user.user_name}:`, error.message);
    }
  }
};


const readline = require("readline");


// Function to create console menu
const showMenu = () => {
  console.log(`
=========================
 Social Media Script Menu
=========================
1. Register Users
2. Bring Users to Life
3. Populate With Posts
4. Simulate Following
5. Like Posts
6. Add Comments
0. Exit

`);
};

// Function to handle user input
const handleUserInput = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

  while (true) {
    showMenu();
    const choice = await askQuestion("Enter your choice: ");

    switch (choice.trim()) {
      case "1":
        const registerCount = await askQuestion("How many users to register? ");
        await register(parseInt(registerCount, 10));
        break;
      case "2":
        const lifeCount = await askQuestion("How many users to bring to life(put zero for all users)? ");
        await bringUsersToLifeee(parseInt(lifeCount, 10));
        break;
      case "3":
        const postUsersCount = await askQuestion("How many users to To Make Post on(put zero for all users)? ");
        await populateWithPosts(parseInt(postUsersCount, 10));
        break;
      case "4":
        const followUsersCount = await askQuestion("How many users to simulate following relationships (put zero for all users)? ");
        await simulateFollowing(parseInt(followUsersCount, 10));
        break;

      case "5":
        const likeUsersCount = await askQuestion("How many users to like posts (put zero for all users)? ");
        await likePosts(parseInt(likeUsersCount, 10));
        break;

      case "6":
        const commentUsersCount = await askQuestion("How many users to add comments on posts (put zero for all users)? ");
        await addComments(parseInt(commentUsersCount, 10));
        break;

      case "0":
        console.log("Exiting...");
        rl.close();
        return;
      default:
        console.log("Invalid choice. Please select a valid option.");
    }
  }
};

// Start the console menu
handleUserInput().catch((error) => console.error("Error:", error));
