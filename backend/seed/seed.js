const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Video = require('../models/Video');
const Course = require('../models/Course');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitdish';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({ role: { $in: ['user', 'chef'] } });
    await Category.deleteMany({});
    await Video.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Demo User
    const hashedPassword = await bcrypt.hash('password123', 12);
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@fitdish.com',
      password: hashedPassword,
      role: 'user',
      dietType: 'non-vegetarian',
      fitnessGoals: ['Weight Loss', 'General Health']
    });
    console.log('✅ Created demo user');

    // Create Categories
    const categories = [
      // Indian Categories
      { 
        name: 'Kashmiri', 
        slug: 'kashmiri', 
        type: 'Indian', 
        imageUrl: 'https://source.unsplash.com/featured/?kashmiri-food', 
        description: 'Kashmiri cuisine is rich, aromatic, and influenced by Persian flavors. It uses yogurt, dry fruits, fennel, and slow-cooked techniques.',
        foods: ['Rogan Josh', 'Dum Aloo', 'Yakhni', 'Gushtaba', 'Kashmiri Pulao', 'Tabak Maaz']
      },
      { 
        name: 'Punjabi', 
        slug: 'punjabi', 
        type: 'Indian', 
        imageUrl: 'https://source.unsplash.com/featured/?punjabi-food', 
        description: 'Hearty and robust Punjabi dishes known for rich flavors, butter, and cream. Perfect for fitness enthusiasts seeking protein-rich meals.',
        foods: ['Butter Chicken', 'Dal Makhani', 'Chole', 'Paratha', 'Sarson Ka Saag', 'Makki Ki Roti']
      },
      { 
        name: 'Gujarati', 
        slug: 'gujarati', 
        type: 'Indian', 
        imageUrl: 'https://source.unsplash.com/featured/?gujarati-food', 
        description: 'Sweet and savory Gujarati dishes that balance flavors beautifully. Mostly vegetarian, perfect for healthy eating.',
        foods: ['Dhokla', 'Gujarati Thali', 'Undhiyu', 'Khandvi', 'Thepla', 'Fafda']
      },
      { 
        name: 'Maharashtrian', 
        slug: 'maharashtrian', 
        type: 'Indian', 
        imageUrl: 'https://source.unsplash.com/featured/?maharashtrian-food', 
        description: 'Spicy and flavorful Maharashtrian food with a perfect blend of sweet, sour, and spicy tastes.',
        foods: ['Pav Bhaji', 'Misal Pav', 'Vada Pav', 'Puran Poli', 'Sabudana Khichdi', 'Poha']
      },
      { 
        name: 'South Indian', 
        slug: 'south-indian', 
        type: 'Indian', 
        imageUrl: 'https://source.unsplash.com/featured/?south-indian-food', 
        description: 'Traditional South Indian cuisine featuring rice, lentils, and coconut. Light, healthy, and nutritious.',
        foods: ['Dosa', 'Idli', 'Sambar', 'Rasam', 'Upma', 'Pongal']
      },
      { 
        name: 'Bengali', 
        slug: 'bengali', 
        type: 'Indian', 
        imageUrl: 'https://source.unsplash.com/featured/?bengali-food', 
        description: 'Sweet and spicy Bengali cuisine known for fish dishes, sweets, and balanced flavors.',
        foods: ['Fish Curry', 'Rasgulla', 'Sandesh', 'Macher Jhol', 'Chingri Malai Curry', 'Mishti Doi']
      },
      { 
        name: 'Rajasthani', 
        slug: 'rajasthani', 
        type: 'Indian', 
        imageUrl: 'https://source.unsplash.com/featured/?rajasthani-food', 
        description: 'Royal Rajasthani cuisine with rich flavors, ghee, and traditional cooking methods.',
        foods: ['Dal Baati', 'Gatte Ki Sabzi', 'Ker Sangri', 'Laal Maas', 'Bajra Roti', 'Ghevar']
      },
      
      // Cultural Categories
      { 
        name: 'Festival Foods', 
        slug: 'festival-foods', 
        type: 'Cultural', 
        imageUrl: 'https://source.unsplash.com/featured/?festival-food', 
        description: 'Traditional festival recipes made healthy. Celebrate with nutritious versions of your favorite festive dishes.',
        foods: ['Gujiya', 'Kheer', 'Halwa', 'Ladoo', 'Modak', 'Payasam']
      },
      { 
        name: 'Street Food', 
        slug: 'street-food', 
        type: 'Cultural', 
        imageUrl: 'https://source.unsplash.com/featured/?street-food', 
        description: 'Popular Indian street food made healthy. Enjoy your favorite street snacks with a nutritious twist.',
        foods: ['Pav Bhaji', 'Vada Pav', 'Chaat', 'Dahi Puri', 'Bhel Puri', 'Samosa']
      },
      { 
        name: 'Regional Thalis', 
        slug: 'regional-thalis', 
        type: 'Cultural', 
        imageUrl: 'https://source.unsplash.com/featured/?thali', 
        description: 'Complete regional meal platters offering balanced nutrition. Perfect for a wholesome meal.',
        foods: ['Gujarati Thali', 'Rajasthani Thali', 'South Indian Thali', 'Punjabi Thali', 'Maharashtrian Thali', 'Bengali Thali']
      },
      
      // Global Categories
      { 
        name: 'Italian', 
        slug: 'italian', 
        type: 'Global', 
        imageUrl: 'https://source.unsplash.com/featured/?italian-food', 
        description: 'Healthy Italian cuisine focusing on fresh ingredients, olive oil, and balanced nutrition.',
        foods: ['Pasta', 'Risotto', 'Bruschetta', 'Margherita Pizza', 'Minestrone', 'Caprese Salad']
      },
      { 
        name: 'Japanese', 
        slug: 'japanese', 
        type: 'Global', 
        imageUrl: 'https://source.unsplash.com/featured/?japanese-food', 
        description: 'Traditional Japanese dishes emphasizing balance, freshness, and nutritional value.',
        foods: ['Sushi', 'Ramen', 'Bento Bowl', 'Miso Soup', 'Teriyaki', 'Tempura']
      },
      { 
        name: 'Mexican', 
        slug: 'mexican', 
        type: 'Global', 
        imageUrl: 'https://source.unsplash.com/featured/?mexican-food', 
        description: 'Authentic Mexican food with healthy twists. Fresh, flavorful, and fitness-friendly.',
        foods: ['Tacos', 'Burrito Bowl', 'Guacamole', 'Quesadilla', 'Enchiladas', 'Salsa']
      },
      { 
        name: 'Mediterranean', 
        slug: 'mediterranean', 
        type: 'Global', 
        imageUrl: 'https://source.unsplash.com/featured/?mediterranean-food', 
        description: 'Mediterranean diet recipes known for heart health, fresh vegetables, and olive oil.',
        foods: ['Hummus', 'Greek Salad', 'Quinoa Bowl', 'Falafel', 'Tzatziki', 'Grilled Fish']
      },
      { 
        name: 'Chinese', 
        slug: 'chinese', 
        type: 'Global', 
        imageUrl: 'https://source.unsplash.com/featured/?chinese-food', 
        description: 'Healthy Chinese cuisine with minimal oil, fresh vegetables, and balanced flavors.',
        foods: ['Stir Fry', 'Dumplings', 'Hot & Sour Soup', 'Kung Pao', 'Spring Rolls', 'Mapo Tofu']
      },
      { 
        name: 'Thai', 
        slug: 'thai', 
        type: 'Global', 
        imageUrl: 'https://source.unsplash.com/featured/?thai-food', 
        description: 'Aromatic Thai dishes with fresh herbs, spices, and balanced sweet-sour-spicy flavors.',
        foods: ['Pad Thai', 'Tom Yum', 'Green Curry', 'Som Tam', 'Massaman Curry', 'Mango Sticky Rice']
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create Chefs
    const chefs = [
      {
        name: 'Chef Sanjeev',
        email: 'sanjeev@fitdish.com',
        password: hashedPassword,
        role: 'chef',
        cuisineSpecialties: ['punjabi', 'kashmiri', 'festival-foods'],
        bio: 'Celebrity chef and TV personality, known for making Indian cuisine accessible to millions. Specializes in healthy, traditional recipes.',
        experience: 30,
        avatar: 'https://source.unsplash.com/featured/?chef,portrait,man',
        rating: 4.8,
        totalReviews: 1250,
        isVerified: true
      },
      {
        name: 'Chef Ranveer',
        email: 'ranveer@fitdish.com',
        password: hashedPassword,
        role: 'chef',
        cuisineSpecialties: ['punjabi', 'street-food', 'regional-thalis'],
        bio: 'MasterChef India judge and culinary expert. Passionate about preserving traditional Indian cooking methods with a modern twist.',
        experience: 25,
        avatar: 'https://source.unsplash.com/featured/?chef,portrait,man',
        rating: 4.9,
        totalReviews: 980,
        isVerified: true
      },
      {
        name: 'Chef Kunal',
        email: 'kunal@fitdish.com',
        password: hashedPassword,
        role: 'chef',
        cuisineSpecialties: ['punjabi', 'kashmiri', 'festival-foods'],
        bio: 'Award-winning chef focusing on healthy, nutritious Indian cuisine. Makes traditional recipes fit for modern lifestyles.',
        experience: 20,
        avatar: 'https://source.unsplash.com/featured/?chef,portrait,man',
        rating: 4.7,
        totalReviews: 750,
        isVerified: true
      },
      {
        name: 'Chef Aditi',
        email: 'aditi@fitdish.com',
        password: hashedPassword,
        role: 'chef',
        cuisineSpecialties: ['gujarati', 'south-indian', 'regional-thalis'],
        bio: 'Expert in Ayurvedic and healthy Indian cooking. Specializes in traditional vegetarian recipes with modern nutritional benefits.',
        experience: 15,
        avatar: 'https://source.unsplash.com/featured/?chef,portrait,woman',
        rating: 4.6,
        totalReviews: 520,
        isVerified: true
      },
      {
        name: 'Chef Maria',
        email: 'maria@fitdish.com',
        password: hashedPassword,
        role: 'chef',
        cuisineSpecialties: ['italian', 'mediterranean'],
        bio: 'Italian chef specializing in healthy Mediterranean cuisine. Expert in creating nutritious, authentic Italian dishes.',
        experience: 18,
        avatar: 'https://source.unsplash.com/featured/?chef,portrait,woman',
        rating: 4.7,
        totalReviews: 420,
        isVerified: true
      },
      {
        name: 'Chef Kenji',
        email: 'kenji@fitdish.com',
        password: hashedPassword,
        role: 'chef',
        cuisineSpecialties: ['japanese', 'mediterranean'],
        bio: 'Japanese culinary master focusing on healthy, balanced meals. Expert in traditional Japanese cooking techniques.',
        experience: 22,
        avatar: 'https://source.unsplash.com/featured/?chef,portrait,man',
        rating: 4.8,
        totalReviews: 560,
        isVerified: true
      }
    ];

    const createdChefs = await User.insertMany(chefs);
    console.log(`✅ Created ${createdChefs.length} chefs`);

    // Create Videos
    const videos = [
      {
        title: 'Authentic Kashmiri Dum Aloo - Healthy Recipe',
        chef: createdChefs[0]._id,
        category: createdCategories.find(c => c.slug === 'kashmiri')._id,
        categorySlug: 'kashmiri',
        duration: 20,
        caloriesEstimate: 280,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/4aZr5hZXP_s',
        description: 'Learn to make traditional Kashmiri dum aloo with a healthy twist. Low oil, high flavor.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?kashmiri-food'
      },
      {
        title: 'Healthy Punjabi Dinner - Dal Makhani',
        chef: createdChefs[1]._id,
        category: createdCategories.find(c => c.slug === 'punjabi')._id,
        categorySlug: 'punjabi',
        duration: 25,
        caloriesEstimate: 320,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
        description: 'Protein-rich dal makhani made healthy with minimal oil and maximum nutrition.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?dal-makhani'
      },
      {
        title: 'Gujarati Khichdi - One Pot Healthy Meal',
        chef: createdChefs[3]._id,
        category: createdCategories.find(c => c.slug === 'gujarati')._id,
        categorySlug: 'gujarati',
        duration: 18,
        caloriesEstimate: 200,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Comforting Gujarati khichdi with vegetables - perfect for a healthy dinner.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?khichdi'
      },
      {
        title: 'Italian Pasta for Fitness Diet',
        chef: createdChefs[4]._id,
        category: createdCategories.find(c => c.slug === 'italian')._id,
        categorySlug: 'italian',
        duration: 15,
        caloriesEstimate: 350,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
        description: 'Healthy pasta primavera with fresh vegetables and minimal oil.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?pasta'
      },
      {
        title: 'Japanese Bento Basics - Healthy Meal Prep',
        chef: createdChefs[5]._id,
        category: createdCategories.find(c => c.slug === 'japanese')._id,
        categorySlug: 'japanese',
        duration: 22,
        caloriesEstimate: 400,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
        description: 'Learn to prepare healthy Japanese bento boxes for meal prep.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?bento'
      },
      {
        title: 'South Indian Dosa - Healthy Breakfast',
        chef: createdChefs[3]._id,
        category: createdCategories.find(c => c.slug === 'south-indian')._id,
        categorySlug: 'south-indian',
        duration: 12,
        caloriesEstimate: 150,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/4aZr5hZXP_s',
        description: 'Crispy, healthy dosa perfect for a nutritious breakfast.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?dosa'
      },
      {
        title: 'Festival Special - Healthy Gujiya',
        chef: createdChefs[2]._id,
        category: createdCategories.find(c => c.slug === 'festival-foods')._id,
        categorySlug: 'festival-foods',
        duration: 22,
        caloriesEstimate: 180,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
        description: 'Traditional gujiya made with healthy ingredients for festivals.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?gujiya'
      },
      {
        title: 'Street Food - Healthy Pav Bhaji',
        chef: createdChefs[1]._id,
        category: createdCategories.find(c => c.slug === 'street-food')._id,
        categorySlug: 'street-food',
        duration: 18,
        caloriesEstimate: 240,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Mumbai street food favorite made healthy with fresh vegetables.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?pav-bhaji'
      },
      {
        title: 'Mediterranean Quinoa Bowl',
        chef: createdChefs[4]._id,
        category: createdCategories.find(c => c.slug === 'mediterranean')._id,
        categorySlug: 'mediterranean',
        duration: 15,
        caloriesEstimate: 320,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
        description: 'Nutritious Mediterranean quinoa bowl with fresh vegetables.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?quinoa'
      },
      {
        title: 'Rajasthani Dal Baati - Healthy Version',
        chef: createdChefs[0]._id,
        category: createdCategories.find(c => c.slug === 'rajasthani')._id,
        categorySlug: 'rajasthani',
        duration: 30,
        caloriesEstimate: 380,
        youtubeEmbedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
        description: 'Traditional Rajasthani dal baati made healthier for modern diets.',
        isFree: true,
        thumbnail: 'https://source.unsplash.com/featured/?dal-baati'
      }
    ];

    const createdVideos = await Video.insertMany(videos);
    console.log(`✅ Created ${createdVideos.length} videos`);

    // Create Courses
    const courses = [
      {
        title: 'Complete Kashmiri Home Cooking',
        chef: createdChefs[0]._id,
        category: createdCategories.find(c => c.slug === 'kashmiri')._id,
        categorySlug: 'kashmiri',
        description: 'Master authentic Kashmiri cuisine with this comprehensive course. Learn traditional recipes, cooking techniques, and how to make healthy versions of classic dishes.',
        difficulty: 'intermediate',
        duration: 120,
        price: 999,
        videos: [
          createdVideos[0]._id, // Kashmiri Dum Aloo
          createdVideos[9]._id  // Rajasthani Dal Baati (as example)
        ],
        thumbnail: 'https://source.unsplash.com/featured/?kashmiri-food',
        isPublished: true
      },
      {
        title: 'Healthy Punjabi Cooking Masterclass',
        chef: createdChefs[1]._id,
        category: createdCategories.find(c => c.slug === 'punjabi')._id,
        categorySlug: 'punjabi',
        description: 'Learn to cook delicious Punjabi meals that are both authentic and healthy. Perfect for fitness enthusiasts who love North Indian food.',
        difficulty: 'beginner',
        duration: 90,
        price: 799,
        videos: [
          createdVideos[1]._id, // Healthy Punjabi Dinner
          createdVideos[7]._id  // Street Food Pav Bhaji
        ],
        thumbnail: 'https://source.unsplash.com/featured/?punjabi-food',
        isPublished: true
      },
      {
        title: 'Mediterranean & Italian Healthy Meals',
        chef: createdChefs[4]._id,
        category: createdCategories.find(c => c.slug === 'italian')._id,
        categorySlug: 'italian',
        description: 'Discover the secrets of healthy Mediterranean and Italian cooking. Learn to create nutritious, flavorful dishes that support your fitness goals.',
        difficulty: 'beginner',
        duration: 75,
        price: 899,
        videos: [
          createdVideos[3]._id, // Italian Pasta
          createdVideos[8]._id  // Mediterranean Quinoa Bowl
        ],
        thumbnail: 'https://source.unsplash.com/featured/?mediterranean-food',
        isPublished: true
      },
      {
        title: 'Japanese Meal Prep Essentials',
        chef: createdChefs[5]._id,
        category: createdCategories.find(c => c.slug === 'japanese')._id,
        categorySlug: 'japanese',
        description: 'Master Japanese cooking techniques and learn to prepare healthy bento boxes for meal prep. Perfect for busy professionals.',
        difficulty: 'intermediate',
        duration: 100,
        price: 1199,
        videos: [
          createdVideos[4]._id  // Japanese Bento Basics
        ],
        thumbnail: 'https://source.unsplash.com/featured/?japanese-food',
        isPublished: true
      }
    ];

    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} courses`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: 1 (demo user)`);
    console.log(`   - Chefs: ${createdChefs.length}`);
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Videos: ${createdVideos.length}`);
    console.log(`   - Courses: ${createdCourses.length}`);
    console.log('\n🔑 Demo Credentials:');
    console.log('   Email: demo@fitdish.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seed
seedData();
