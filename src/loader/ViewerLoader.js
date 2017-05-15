// @flow

type ViewerType = {
  id: ?string,
}

export default class Viewer {
  id: ?string;

  constructor(data: ViewerType) {
    this.id = data.id;
  }

  static async load(userId) {
    const data = {
      id: userId,
    };

    return new Viewer(data);
  }

  // There is no need for a DataLoader instance here.
  static getLoader = () => Viewer;
}
