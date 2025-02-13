const addToWishlist = async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.userId);
  
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
  
    res.json(user.wishlist);
  };
  
  module.exports = { addToWishlist };