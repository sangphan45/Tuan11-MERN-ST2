class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const param = {
      $regex: this.queryStr.keyword || '',
      $options: 'i',
    };

    this.query = this.query.find({
      $or: [{ name: param }, { description: param }, { category: param }],
    });
    return this;
  }

  filter() {
    let queryCopy = { ...this.queryStr };

    const param = {
      $regex: this.queryStr.keyword || '',
      $options: 'i',
    };

    const multiSearchColumn = queryCopy.multiSearchColumn
      ? queryCopy.multiSearchColumn
          .split(',')
          .reduce((searchColumn, currentValue) => {
            if (queryCopy.keyword && queryCopy.keyword.length > 0) {
              searchColumn[currentValue] = param;
              searchColumn = { ...searchColumn } || '';
            }
            return searchColumn;
          }, {})
      : undefined;

    if (multiSearchColumn) queryCopy = { ...queryCopy, ...multiSearchColumn };

    console.log(multiSearchColumn);

    // Removing fields from the query
    const removeFields = ['keyword', 'limit', 'page', 'multiSearchColumn'];
    removeFields.forEach((el) => delete queryCopy[el]);

    // Advance filter for price, ratings etc
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find({
      $or: [JSON.parse(queryStr)],
    });
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }

  sort() {
    let sortList = this.queryStr.sort || undefined;

    if (!sortList) return this;
    sortList = sortList.split(',');
    if (sortList.length === 1 || sortList.length > 2) return this;
    if (
      sortList[1] !== 'asc' &&
      sortList[1] !== 'desc' &&
      sortList[1] !== 'ascending' &&
      sortList[1] !== 'descending'
    )
      return this;
    const field = sortList[0];
    const sortDir = sortList[1];
    this.query = this.query.sort({ [field]: sortDir });
    return this;
  }
}

module.exports = APIFeatures;
