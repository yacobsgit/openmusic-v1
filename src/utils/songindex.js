/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  AlbumId
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  AlbumId
})

module.exports = { mapDBToModel }
