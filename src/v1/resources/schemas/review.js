const base = {
  intro: {
    type: ['string', 'null']
  },
  content: {
    type: ['string', 'null']
  },
  rating: {
    type: ['number', 'null']
  },
  favoriteTrack: {
    type: ['string', 'null']
  },
  draft: {
    type: 'boolean',
    default: true
  },
  genres: {
    type: 'array',
    items: {
      type: 'string'
    },
    uniqueItems: true
  },
  spotifyAlbumId: {
    type: ['string', 'null']
  }
};

const create = { ...base };
const update = { ...base };

module.exports = {
  create,
  update
};
