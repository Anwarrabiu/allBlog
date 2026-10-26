
const getHealth = (req, res) => {
    
  res.status(200).json({
    success: true,
    message: "MERN Blog API is running!",
  });
};

module.exports = { getHealth };
