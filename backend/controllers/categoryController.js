// const Category = require('../models/Category');

// // @desc    Get all categories
// // @route   GET /api/categories
// // @access  Public
// exports.getAllCategories = async (req, res) => {
//   try {
//     const categories = await Category.find().sort('type name');
    
//     res.status(200).json({
//       success: true,
//       count: categories.length,
//       categories
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get categories by type
// // @route   GET /api/categories/type/:type
// // @access  Public
// exports.getCategoriesByType = async (req, res) => {
//   try {
//     const { type } = req.params;
//     const categories = await Category.find({ type }).sort('name');
    
//     res.status(200).json({
//       success: true,
//       count: categories.length,
//       categories
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get single category by slug or id with related data
// // @route   GET /api/categories/:identifier
// // @access  Public
// exports.getCategory = async (req, res) => {
//   try {
//     const { identifier } = req.params;
//     let category;
    
//     // Try to find by slug first (case-insensitive), then by id
//     category = await Category.findOne({ 
//       slug: identifier.toLowerCase() 
//     });
//     if (!category) {
//       category = await Category.findById(identifier);
//     }
    
//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: 'Category not found'
//       });
//     }

//     // Fetch related videos and chefs
//     const Video = require('../models/Video');
//     const User = require('../models/User');
    
//     // Get videos for this category
//     const relatedVideos = await Video.find({ 
//       category: category._id,
//       isFree: true 
//     })
//       .populate('chef', 'name avatar rating')
//       .populate('category', 'name type slug imageUrl')
//       .sort('-createdAt')
//       .limit(12);

//     // Get chefs who specialize in this category (match by slug)
//     const relatedChefs = await User.find({
//       role: 'chef',
//       $or: [
//         { cuisineSpecialties: category.slug },
//         { cuisineSpecialties: category.name.toLowerCase() },
//         { cuisineSpecialties: { $regex: new RegExp(category.slug, 'i') } }
//       ]
//     })
//       .select('name avatar rating totalReviews bio cuisineSpecialties isVerified')
//       .limit(12);

//     res.status(200).json({
//       success: true,
//       category,
//       relatedVideos,
//       relatedChefs
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


const categories = [
  {
    _id: "cat1",
    name: "Bengali",
    slug: "bengali",
    type: "Indian",
    imageUrl: "https://th.bing.com/th/id/R.c10eb6eba9c05a7fe085253346e84418?rik=0Pa857OYzF63LA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-Q09XMt2yzmI%2fTo7ktrG5YWI%2fAAAAAAAAAX0%2foc7DUWelYIc%2fs1600%2fBengali%2bFood.jpg&ehk=834JuY7Wh5LQ1hYyxBmkoydZXzQUJipI%2bBdlYi6iZxo%3d&risl=&pid=ImgRaw&r=0",
    description: "Traditional Bengali cuisine",
    foods: ["Fish Curry", "Mishti Doi","Sandesh","Rasgulla"]
  },
  {
    _id: "cat2",
    name: "Gujarati",
    slug: "gujarati",
    type: "Indian",
    imageUrl: "https://tse2.mm.bing.net/th/id/OIP.jd0TruBUMOMVKBUXrEJRiwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Healthy Gujarati food",
    foods: ["Dhokla", "Thepla","Fafda","Khandvi","Undhiyu"]
  },
  {
    _id: "cat3",
    name: "Kashmiri",
    slug: "kashmiri",
    type: "Indian",
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.0eqeNgCgzGN1W5smwrBZmAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Rich Kashmiri cuisine",
    foods: ["Dum Aloo", "kashmiri Pulao","Rogan Josh"]
  },
  {
    _id: "cat4",
    name: "Maharashtrian",
    slug: "maharashtrian",
    type: "Indian",
    imageUrl: "https://img.veenaworld.com/wp-content/uploads/2019/09/10-Delicious-Maharashtrian-Dishes-that-You-Must-Try.jpg",
    description: "Traditional Maharashtrian cuisine",
    foods: ["Vada Pav", "Misal Pav"]
  },
  {
    _id: "cat5",
    name: "Punjabi",
    slug: "punjabi",
    type: "Indian",
    imageUrl: "https://just-eat-prod-sg-res.cloudinary.com/image/upload/c_fill,f_auto,q_auto,w_1200,h_630,d_au:cuisines:indian-7.jpg/v1/au/restaurants/4969137.jpg",
    description: "Rich Punjabi cuisine",
    foods: ["Paratha", "Chole"]
  },
  {
    _id: "cat6",
    name: "Rajasthani",
    slug: "rajasthani",
    type: "Indian",
    imageUrl: "https://www.secondrecipe.com/wp-content/uploads/2020/11/dal-bati-churma.jpg",
    description: "Traditional Rajasthani cuisine",
    foods: ["Ghevar", "Dal Baati"]
  },
  {
    _id: "cat7",
    name: "Chinese",
    slug: "chinese",
    type: "Global",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
    description: "Popular Chinese dishes",
    foods: ["Noodles", "Stir Fry"]
  },
  {
    _id: "cat8",
    name: "Italian",
    slug: "italian",
    type: "Global",
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.XmBUdBJyH9C8J90v4th0vwHaEO?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Classic Italian cuisine",
    foods: ["Pasta", "Pizza"]
  },
  {
    _id: "cat9",
    name: "Japanese",
    slug: "japanese",
    type: "Global",
    imageUrl: "https://tse1.mm.bing.net/th/id/OIP.buFEazU4Hl1vjrK0xKq4LwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Classic Japanese cuisine",
    foods: ["Ramen", "Sushi"]
  },
  {
    _id: "cat10",
    name: "Mediterranean",
    slug: "mediterranean",
    type: "Global",
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.9XwS1iDfXOVOtz5JRUVmFQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Classic Mediterranean cuisine",
    foods: ["Greek Salad", "Hummus"]
  },
  {
    _id: "cat11",
    name: "Mexican",
    slug: "mexican",
    type: "Global",
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.krYWMASpAptTYecs56ZxCwHaEO?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Classic Mexican cuisine",
    foods: ["Tacos", "Salsa"]
  },
  {
    _id: "cat12",
    name: "Thai",
    slug: "thai",
    type: "Global",
    imageUrl: "https://speedy.uenicdn.com/1d644ed5-b758-4229-b8ba-736fa89e3df2/c928_a/image/upload/v1684866693/business/015a869d-d333-4348-aa40-fa3fc741e9a8.jpg",
    description: "Classic Thai cuisine",
    foods: ["Pad Thai", "Green Curry"]
  }
];

// ===============================
// GET ALL CATEGORIES
// GET /api/categories
// ===============================
exports.getAllCategories = (req, res) => {
  res.status(200).json({
    success: true,
    count: categories.length,
    categories
  });
};

// ===============================
// GET CATEGORY BY SLUG
// GET /api/categories/:slug
// ===============================
exports.getCategory = (req, res) => {
  const category = categories.find(
    c => c.slug === req.params.identifier
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found"
    });
  }

  res.status(200).json({
    success: true,
    category,
    relatedVideos: [], // videos already handled separately
    relatedChefs: []   // chefs already handled separately
  });
};

// ===============================
// GET CATEGORIES BY TYPE
// GET /api/categories/type/:type
// ===============================
exports.getCategoriesByType = (req, res) => {
  const filtered = categories.filter(
    c => c.type.toLowerCase() === req.params.type.toLowerCase()
  );

  res.status(200).json({
    success: true,
    count: filtered.length,
    categories: filtered
  });
};