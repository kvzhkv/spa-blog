module.exports = [
  {
    _id: '_design/admin',
    language: 'javascript',
    views: {
      posts: {
        map: function (doc) {
          if (doc.type === 'post') {
            var length = 0;
            var text = '';
            doc.post.text.ops.forEach(function(item) {
              text = text + item.insert;
            });
            length = text.length;
            if (doc.post.cut) {
              emit(doc.post.date, {
                type: doc.type,
                published: doc.published,
                post: {
                  title: doc.post.title,
                  imageUrl: doc.post.imageUrl,
                  cut: doc.post.cut,
                  date: doc.post.date,
                  tags: doc.post.tags,
                  length: length
                }
              });
            } else {
              var i = 0;
              var cut = '';
              do {
                cut = cut + doc.post.text.ops[i].insert;
                i++;
              } while (cut.length < 198);
              cut = cut.substr(0, 197);
              while (cut[cut.length - 1] === ' ') {
                cut = cut.slice(0, -1);
              }
              cut = cut + '...';
              emit(doc.post.date, {
                type: doc.type,
                published: doc.published,
                post: {
                  title: doc.post.title,
                  imageUrl: doc.post.imageUrl,
                  cut: cut,
                  date: doc.post.date,
                  tags: doc.post.tags,
                  length: length
                }
              });
            }
          }
        }
      }
    }
  },
  {
    _id: '_design/blog',
    language: 'javascript',
    views: {
      posts: {
        map: function (doc) {
          if (doc.type === 'post' && doc.published) {
            var length = 0;
            var text = '';
            doc.post.text.ops.forEach(function(item) {
              text = text + item.insert;
            });
            length = text.length;
            if (doc.post.cut) {
              emit(doc.post.date, {
                title: doc.post.title,
                imageUrl: doc.post.imageUrl,
                cut: doc.post.cut,
                date: doc.post.date,
                tags: doc.post.tags,
                length: length
              });
            } else {
              var i = 0;
              var cut = '';
              do {
                cut = cut + doc.post.text.ops[i].insert;
                i++;
              } while (cut.length < 198);
              cut = cut.substr(0, 197);
              while (cut[cut.length - 1] === ' ') {
                cut = cut.slice(0, -1);
              }
              cut = cut + '...';
              emit(doc.post.date, {
                title: doc.post.title,
                imageUrl: doc.post.imageUrl,
                cut: cut,
                date: doc.post.date,
                tags: doc.post.tags,
                length: length
              });
            }
          }
        }
      },
      tags: {
        map: function (doc) {
          if (doc.type === 'post' && doc.published) {
            doc.post.tags.forEach(function (tag) {
              emit(tag, 1);
            });
          }
        },
        reduce: function (key, values, rereduce) {
          return sum(values);
        }
      },
      postsbytags: {
        map: function (doc) {
          if (doc.type === 'post' && doc.published) {
            doc.post.tags.forEach(function (tag) {
              var length = 0;
              var text = '';
              doc.post.text.ops.forEach(function (item) {
                text = text + item.insert;
              });
              length = text.length;
              if (doc.post.cut) {
                emit([tag, doc.post.date], {
                  title: doc.post.title,
                  imageUrl: doc.post.imageUrl,
                  cut: doc.post.cut,
                  date: doc.post.date,
                  tags: doc.post.tags,
                  length: length
                });
              } else {
                var i = 0;
                var cut = '';
                do {
                  cut = cut + doc.post.text.ops[i].insert;
                  i++;
                } while (cut.length < 198);
                cut = cut.substr(0, 197) + '...';
                emit([tag, doc.post.date], {
                  title: doc.post.title,
                  imageUrl: doc.post.imageUrl,
                  cut: cut,
                  date: doc.post.date,
                  tags: doc.post.tags,
                  length: length
                });
              }
            });
          }
        }
      }
    }
  },
  {
    _id: 'menu',
    menuItems: [{
      tag: 'tag',
      subtags: []
    }],
    type: 'menu'
  }
];
