class UserController {
  async getAllUsers(req, res) {
    try {
      const { ...rest } = req.body;
      res.status(200).json({
        susscess: true,
        data: { ...rest },
      });
    } catch (error) {
      res.status(501).json({
        susscess: false,
        message: error.message,
      });
    }
  }
}

export default new UserController();
