class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filterByCategory() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["title"];

    excludedFields.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj);

    return this;
  }

  search() {
    if (this.queryStr.title) {
      this.query = this.query.find({ $text: { $search: this.queryStr.title } });
    } else {
      this.query = this.query.find();
    }

    return this;
  }
}

export default APIFeatures;
