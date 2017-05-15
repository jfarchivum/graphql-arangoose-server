// @flow

export default class ConnectionFromArangoCursor {

  static PREFIX = 'arango:';

  static base64 = str => (new Buffer(str, 'ascii')).toString('base64');
  static unbase64 = b64 => (new Buffer(b64, 'base64')).toString('ascii');

  /**
   * Rederives the offset from the cursor string
   */
  static cursorToOffset(cursor) {
    return parseInt(ConnectionFromArangoCursor.unbase64(cursor).substring(ConnectionFromArangoCursor.PREFIX.length), 10);
  }

  /**
   * Given an optional cursor and a default offset, returns the offset to use;
   * if the cursor contains a valid offset, that will be used, otherwise it will
   * be the default.
   */
  static getOffsetWithDefault(cursor, defaultOffset) {
    if (cursor === undefined || cursor === null) {
      return defaultOffset;
    }
    const offset = ConnectionFromArangoCursor.cursorToOffset(cursor);
    return isNaN(offset) ? defaultOffset : offset;
  }

  /**
   * Creates the cursor string from an offset.
   */
  static offsetToCursor(offset) {
    return ConnectionFromArangoCursor.base64(ConnectionFromArangoCursor.PREFIX + offset);
  }

  /**
   * Accepts a arangodb cursor and connection arguments, and returns a connection
   * object for use in GraphQL. It uses array offsets as pagination, so pagiantion
   * will work only if the data set is satic.
   */
  static async connectionFromArangoCursor(context, inArangoCursor, args = {}, loader) {
    const arangodbCursor = inArangoCursor;
    const { after, before } = args;
    let { first, last } = args;

    // Limit the maximum number of elements in a query
    if (!first && !last) first = 10;
    if (first > 1000) first = 1000;
    if (last > 1000) last = 1000;

    const count = await inArangoCursor.count();
    // returning arangoose query obj to find again after count
    inArangoCursor.find();

    const beforeOffset = ConnectionFromArangoCursor.getOffsetWithDefault(before, count);
    const afterOffset = ConnectionFromArangoCursor.getOffsetWithDefault(after, -1);


    let startOffset = Math.max(-1, afterOffset) + 1;
    let endOffset = Math.min(count, beforeOffset);

    if (first !== undefined) {
      endOffset = Math.min(endOffset, startOffset + first);
    }
    if (last !== undefined) {
      startOffset = Math.max(startOffset, endOffset - last);
    }

    const skip = Math.max(startOffset, 0);


    const limit = endOffset - startOffset;

    // If supplied slice is too large, trim it down before mapping over it.
    arangodbCursor.slice(skip, limit)
    // arangodbCursor.skip(skip);
    // arangodbCursor.limit(limit);


    // Short circuit if limit is 0; in that case, arangodb doesn't limit at all
    const slice = await arangodbCursor.exec();

    const edges = slice.map((value, index) => ({
      cursor: ConnectionFromArangoCursor.offsetToCursor(startOffset + index),
      node: loader(context, value._id),
    }));

    const firstEdge = edges[0];
    const lastEdge = edges[edges.length - 1];
    const lowerBound = after ? (afterOffset + 1) : 0;
    const upperBound = before ? Math.min(beforeOffset, count) : count;

    return {
      edges,
      count,
      pageInfo: {
        startCursor: firstEdge ? firstEdge.cursor : null,
        endCursor: lastEdge ? lastEdge.cursor : null,
        hasPreviousPage: last !== null ? startOffset > lowerBound : false,
        hasNextPage: first !== null ? endOffset < upperBound : false,
      },
    };
  }
}
