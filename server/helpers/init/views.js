module.exports = [{
    _id: "_design/admin",
    language: "javascript",
    views: {
      posts: {
        map: function (doc) {
          if (doc.type === "post") {
            if (doc.post.cut) {
              emit(doc.post.date, {
                type: doc.type,
                published: doc.published,
                post: {
                  title: doc.post.title,
                  imageUrl: doc.post.imageUrl,
                  cut: doc.post.cut,
                  date: doc.post.date,
                  tags: doc.post.tags
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
                  tags: doc.post.tags
                }
              });
            }
          }
        }
      }
    }
  },
  {
    _id: "_design/blog",
    language: "javascript",
    views: {
      posts: {
        map: function (doc) {
          if (doc.type === "post" && doc.published) {
            if (doc.post.cut) {
              emit(doc.post.date, {
                title: doc.post.title,
                imageUrl: doc.post.imageUrl,
                cut: doc.post.cut,
                date: doc.post.date,
                tags: doc.post.tags
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
                tags: doc.post.tags
              });
            }
          }
        }
      },
      // tags: {
      //   map: function (doc) {
      //     if (doc.type === "post" && doc.published) {
      //       doc.post.tags.forEach(function (tag) {
      //         emit(tag, 1);
      //       });
      //     }
      //   },
      //   reduce: function (key, values, rereduce) {
      //     return sum(values);
      //   }
      // },
      // favorites: {
      //   map: function (doc) {
      //     if (doc.type === "post" && doc.published) {
      //       doc.post.tags.forEach(function (tag) {
      //         if (tag === "★") {
      //           emit(doc.post.date, {
      //             title: doc.post.title,
      //             imageUrl: doc.post.imageUrl
      //           });
      //         }
      //       });
      //     }
      //   }
      // },
      postsbytags: {
        map: function (doc) {
          if (doc.type === "post" && doc.published) {
            doc.post.tags.forEach(function (tag) {
              if (doc.post.cut) {
                emit([tag, doc.post.date], {
                  title: doc.post.title,
                  imageUrl: doc.post.imageUrl,
                  cut: doc.post.cut,
                  date: doc.post.date,
                  tags: doc.post.tags
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
                  tags: doc.post.tags
                });
              }
            });
          }
        }
      }
    }
  },
  {
    _id: "menu",
    menuItems: [{
      tag: "tag",
      subtags: []
    }],
    type: "menu"
  }
]
