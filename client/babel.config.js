/*
  this should let me use dotenv in frontend. Not entirely sure why you have to do all this but it works !
*/

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv"]
    ]
  };
};