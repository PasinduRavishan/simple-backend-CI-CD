export default class RepoBase {
  constructor(tableName) {
    if (new.target === RepoBase) {
      throw new TypeError('Cannot construct RepoBase instances directly');
    }
    this.tableName = tableName;
  }

 
  async save(record) {
    throw new Error('Method save() must be implemented');
  }
  async retrieveAll(searchParams) {
    throw new Error('Method retrieveAll() must be implemented');
  }
  async retrieveById(id) {
    throw new Error('Method retrieveById() must be implemented');
  }
  async update(record) {
    throw new Error('Method update() must be implemented');
  }
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }
  async deleteAll() {
    throw new Error('Method deleteAll() must be implemented');
  }
}
