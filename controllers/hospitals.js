const Hosptial = require("../models/Hospital");

/**
 * @desc    Get all hospitals
 * @route   GET /api/v1/hospitals
 * @access  Public
 */
exports.getHospitals = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create operator ($gt, $gte, etc)
    const queryStr = JSON.stringify(req.query).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    let query = Hosptial.find(JSON.parse(queryStr)).populate("appointments");

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Hosptial.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const hospitals = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: hospitals.length,
      pagination,
      data: hospitals,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

/**
 * @desc    Get single hospital
 * @route   GET /api/v1/hospitals/:id
 * @access  Public
 */
exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hosptial.findById(req.params.id);
    if (!hospital) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 * @desc    Create new hospital
 * @route   POST /api/v1/hospitals
 * @access  Private
 */
exports.createHospital = async (req, res, next) => {
  const hospital = await Hosptial.create(req.body);
  res.status(201).json({ success: true, data: hospital });
};

/**
 * @desc    Update hospital
 * @route   PUT /api/v1/hospitals/:id
 * @access  Private
 */
exports.updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hosptial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hospital) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 * @desc    Delete hospital
 * @route   DELETE /api/v1/hospitals/:id
 * @access  Private
 */
exports.deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hosptial.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(400).json({ success: false });
    }
    hospital.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
