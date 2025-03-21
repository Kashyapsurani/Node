const getDashboardController = (req, res) => {

    res.json({
        totalStudent: 500,
        totalCourse: 20,
        totalRevenue: "150$",
        popularCourse: [
            { title: 'al/ml', studentEnrolled: 50 },
            { title: 'React js', studentEnrolled: 150 },
        ]
    })
}

module.exports = { getDashboardController }