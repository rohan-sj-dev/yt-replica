import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const healthcheck = asyncHandler(async (req, res, mw) => {
    return res
        .status(200)
        .json(new ApiResponse(200, "OK", "Health check passed"))

})


export { healthcheck }