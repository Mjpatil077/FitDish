
// 🔹 STATIC YOUTUBE VIDEOS (CATEGORY WISE)
const videos = [
  // ================= Gujarati =================
  {
    _id: "v1",
    title: "Healthy Gujarati Undhiyu",
    description: "Simple and healthy Gujarati food",
    youtubeEmbedUrl: "https://www.youtube.com/embed/76WP69qtDi8",
    isFree: true,
    category: {
      name: "Gujarati",
      slug: "gujarati"
    },
    chef: {
      _id: "c1",
      name: "Chef Sanjyot Keer"
    }
  },
  {
    _id: "v2",
    title: "Healthy Gujarati Dal Dhokli",
    description: "Easy Gujarati breakfast",
    youtubeEmbedUrl: "https://www.youtube.com/embed/ro8pCoI6Xc8",
    isFree: true,
    category: {
      name: "Gujarati",
      slug: "gujarati"
    },
    chef: {
      _id: "c1",
      name: "Chef Sanjyot Keer"
    }
  },
  {
    _id: "v3",
    title: "Healthy Gujarati Fafda",
    description: "Simple and healthy Gujarati food",
    youtubeEmbedUrl: "https://www.youtube.com/embed/M7Fax7-_oDU",
    isFree: true,
    category: {
      name: "Gujarati",
      slug: "gujarati"
    },
    chef: {
      _id: "c1",
      name: "Chef Kanak"
    }
  },
  {
    _id: "v4",
    title: "Healthy Gujarati Nylon Khaman",
    description: "Simple and healthy Gujarati food",
    youtubeEmbedUrl: "https://www.youtube.com/embed/TEGPt00TQxM",
    isFree: true,
    category: {
      name: "Gujarati",
      slug: "gujarati"
    },
    chef: {
      _id: "c1",
      name: "Chef Sanjyot Keer"
    }
  },
   {
    _id: "v5",
    title: "Healthy Gujarati Khandvi",
    description: "Simple and healthy Gujarati food",
    youtubeEmbedUrl: "https://www.youtube.com/embed/ndTp8_1Kdyk",
    isFree: true,
    category: {
      name: "Gujarati",
      slug: "gujarati"
    },
    chef: {
      _id: "c1",
      name: "Chef Kunal Kapur"
    }
  },


  // ================= Punjabi =================
  {
    _id: "v6",
    title: "Healthy Punjabi Dal Makhni",
    description: "Low oil Punjabi cooking",
    youtubeEmbedUrl: "https://www.youtube.com/embed/o3k55z-tv9I",
    isFree: true,
    category: {
      name: "Punjabi",
      slug: "punjabi"
    },
    chef: {
      _id: "c2",
      name: "Chef Kunal Kapur"
    }
  },
  {
    _id: "v7",
    title: "Healthy Punjabi Punjabi Chole",
    description: "Low oil Punjabi cooking",
    youtubeEmbedUrl: "https://www.youtube.com/embed/qPiqvDltIdMI",
    isFree: true,
    category: {
      name: "Punjabi",
      slug: "punjabi"
    },
    chef: {
      _id: "c2",
      name: "Chef Ranveer Brar"
    }
  },
  {
    _id: "v8",
    title: "Healthy Punjabi Punjabi Gobi Paratha",
    description: "Low oil Punjabi cooking",
    youtubeEmbedUrl: "https://www.youtube.com/embed/nR5ndiOwupY",
    isFree: true,
    category: {
      name: "Punjabi",
      slug: "punjabi"
    },
    chef: {
      _id: "c2",
      name: "Chef Ranveer Brar"
    }
  },


  // ================= Italian =================
  {
    _id: "v9",
    title: "Healthy Italian Macaroni Pasta",
    description: "Low calorie Italian pasta",
    youtubeEmbedUrl: "https://www.youtube.com/embed/r79HcXZ_41o",
    isFree: true,
    category: {
      name: "Italian",
      slug: "italian"
    },
    chef: {
      _id: "c3",
      name: "Chef Bharat"
    }
  },
  {
    _id: "v10",
    title: "Tawa Cheese Burst Pizza",
    description: "NO OVEN & NO YEAST",
    youtubeEmbedUrl: "https://www.youtube.com/embed/XY5nwHIRwKk",
    isFree: true,
    category: {
      name: "Italian",
      slug: "italian"
    },
    chef: {
      _id: "c3",
      name: "Chef Sanjyot Keer"
    }
  },
  {
    _id: "v11",
    title: "Delicious Eggless Tiramisu",
    description: "Famous dessert",
    youtubeEmbedUrl: "https://www.youtube.com/embed/DiBKJyUpaMU",
    isFree: true,
    category: {
      name: "Italian",
      slug: "italian"
    },
    chef: {
      _id: "c3",
      name: "Chef Sneha Singhi"
    }
  },


  // ================= Chinese =================
  {
    _id: "v12",
    title: "Restaurant Style Chinese Bhel",
    description: "Chinese food with less oil",
    youtubeEmbedUrl: "https://www.youtube.com/embed/JBQZyh0mweA",
    isFree: true,
    category: {
      name: "Chinese",
      slug: "chinese"
    },
    chef: {
      _id: "c4",
      name: "Chef Sanjyot Keer"
    }
  },
  {
    _id: "v13",
    title: "Veg Chowmein",
    description: "Chinese food with less oil",
    youtubeEmbedUrl: "https://www.youtube.com/embed/u3vuq3zaR20",
    isFree: true,
    category: {
      name: "Chinese",
      slug: "chinese"
    },
    chef: {
      _id: "c4",
      name: "Chef Bharat"
    }
  }
];

// ===============================
// GET ALL VIDEOS
// GET /api/videos
// ===============================
exports.getAllVideos = (req, res) => {
  const { category } = req.query;
  let result = videos;

  if (category) {
    result = result.filter(
      video => video.category.slug === category
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    videos: result
  });
};

// ===============================
// GET SINGLE VIDEO
// GET /api/videos/:id
// ===============================
exports.getVideo = (req, res) => {
  const video = videos.find(v => v._id === req.params.id);

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found"
    });
  }

  res.status(200).json({
    success: true,
    video
  });
};

// ===============================
// GET VIDEOS BY CATEGORY
// GET /api/videos/category/:categorySlug
// ===============================
exports.getVideosByCategory = (req, res) => {
  result = result.filter(
    video =>
      video.category.slug === category.toLowerCase() ||
      video.category.name.toLowerCase() === category.toLowerCase()
  );
  res.status(200).json({
    success: true,
    count: filtered.length,
    videos: filtered
  });
};

// ===============================
// GET VIDEOS BY CHEF
// GET /api/videos/chef/:chefId
// ===============================
exports.getVideosByChef = (req, res) => {
  const filtered = videos.filter(
    video => video.chef._id === req.params.chefId
  );

  res.status(200).json({
    success: true,
    count: filtered.length,
    videos: filtered
  });
};
