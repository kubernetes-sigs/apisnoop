export default {
  name: 'colours',
  getReducer: () => {
    const initialState = {
      colours: {
        'alpha': 'rgba(230, 25, 75, 1)',
        'beta': 'rgba(0, 130, 200, 1)',
        'stable': 'rgba(60, 180, 75, 1)',
        'unused': 'rgba(255, 255, 255, 1)'
      },
      moreColours: [
        'rgba(183, 28, 28, 1)',
        'rgba(136, 14, 79, 1)',
        'rgba(74, 20, 140, 1)',
        'rgba(49, 27, 146, 1)',
        'rgba(26, 35, 126, 1)',
        'rgba(13, 71, 161, 1)',
        'rgba(1, 87, 155, 1)',
        'rgba(0, 96, 100, 1)',
        'rgba(0, 77, 64, 1)',
        'rgba(27, 94, 32, 1)',
        'rgba(51, 105, 30, 1)',
        'rgba(130, 119, 23, 1)',
        'rgba(245, 127, 23, 1)',
        'rgba(255, 111, 0, 1)',
        'rgba(230, 81, 0, 1)',
        'rgba(191, 54, 12, 1)',
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(103, 58, 183, 1)',
        'rgba(63, 81, 181, 1)',
        'rgba(33, 150, 243, 1)',
        'rgba(3, 169, 244, 1)',
        'rgba(0, 188, 212, 1)',
        'rgba(0, 150, 136, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(139, 195, 74, 1)',
        'rgba(205, 220, 57, 1)',
        'rgba(255, 235, 59, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(255, 152, 0, 1)',
        'rgba(255, 87, 34, 1)'
    
      ],
      categories: [
        "admissionregistration",
        "apiextensions",
        "apiregistration",
        "apis",
        "apps",
        "authentication",
        "authorization",
        "autoscaling",
        "batch",
        "certificates",
        "core",
        "events",
        "extensions",
        "logs",
        "networking",
        "node",
        "policy",
        "rbacAuthorization",
        "scheduling",
        "settings",
        "storage",
        "version",
        "auditregistration",
        "coordination"
      ]
    }
    return (state=initialState, action) => {
      return state
    }
  },
  selectLevelColours: (state) => state.colours.colours,
  selectCategoryColours: (state) => {
    var colours = {}
    for (var catidx = 0; catidx < state.colours.categories.length; catidx++) {
      var category = state.colours.categories[catidx]
      colours['category.' + category] = state.colours.moreColours[(catidx * 3) % state.colours.moreColours.length]
    }
    return colours
  }
  
}
