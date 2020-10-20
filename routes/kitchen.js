const express = require('express');
const { getIncompleteOrders } = require('../db');
const router  = express.Router();

module.exports = (db) => {

  router.get('/', (req, response) => {

    getIncompleteOrders(db).then(res => {
      const incompleteOrderItems = res.rows;
      const orders = {};

      incompleteOrderItems.forEach(item => {
        orders[item.order_id] = {
          created_at: item.created_at,
          description: item.description,
          first_name: item.first_name,
          surname: item.surname,
          phone: item.phone,
          order_items: {}
        }
      });

      incompleteOrderItems.forEach(item => {
        const { order_id, order_item_id } = item;
        const { order_items } = orders[order_id];

        order_items[order_item_id] = {
            menu_item_name: item.menu_item_name,
            quantity: item.quantity
          }
        });


      response.render("kitchen", { orders });
    })
  });
  return router;
};