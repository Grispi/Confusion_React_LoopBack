module.exports = function (app) {
  var Customer = app.models.Customer;

  Customer.findOne({ where: { username: "Admin" } }, (err, users) => {
    if (!users) {
      Customer.create(
        [
          {
            username: "Admin",
            email: "admin@confusion.net",
            password: "password",
          },
        ],
        (err, users) => {
          if (err) throw err;

          var Role = app.models.Role;
          var RoleMapping = app.models.RoleMapping;

          RoleMapping.destroyAll();

          Role.findOne({ where: { name: "admin" } }, (err, role) => {
            if (!role) {
              Role.create({ name: "admin" }, (err, role) => {
                if (err) throw err;

                role.principals.create(
                  {
                    principals: RoleMapping.USER,
                    principalId: users[1].id,
                  },
                  (err, principal) => {
                    if (err) throw err;
                  }
                );
              });
            } else {
              role.principals.create(
                {
                  principals: RoleMapping.USER,
                  principalId: users[0].id,
                },
                (err, principal) => {
                  if (err) throw err;
                }
              );
            }
          });
        }
      );
    }
  });
};
