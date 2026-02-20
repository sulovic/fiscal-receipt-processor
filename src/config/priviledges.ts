/* 
usersRoles: {
   BASE: 1001,
   POWER: 3001,
   ADMIN: 5001
}
   config min priviledges for each route/action
*/

const priviledgesConfig = {
  receipts: {
    GET: 1000,
    POST: 3000,
    PUT: 3000,
    DELETE: 5000,
  },
};

export default priviledgesConfig;
