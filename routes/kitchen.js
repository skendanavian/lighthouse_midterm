const express = require('express');
const {sendSms} = require('../api');
const {getIncompleteOrders, setOrderStatus, getPhoneForOrder} = require('../db');
const router = express.Router();

module.exports = (db) => {

  router.get('/', (req, response) => {

    getIncompleteOrders(db).then(res => {
      const incompleteOrderItems = res.rows;
      const orders = {};

      incompleteOrderItems.forEach(item => {
        orders[item.order_id] = {
          created_at: item.created_at,
          description: item.description,
          status: item.status,
          first_name: item.first_name,
          surname: item.surname,
          phone: item.phone,
          order_items: {}
        };
      });

      incompleteOrderItems.forEach(item => {
        const {order_id, order_item_id} = item;
        const {order_items} = orders[order_id];

        order_items[order_item_id] = {
          menu_item_name: item.menu_item_name,
          quantity: item.quantity
        };
      });

      response.render("kitchen", {orders});
    });
  });

  router.post('/:orderId/complete', (req, response) => {
    const {orderId} = req.params;

    setOrderStatus(db, orderId, 'completed').then(
      response.redirect('/kitchen')
    ).catch((err) => {
      console.log(err);
      response.status(500).send(err);
    });
  });

  router.post('/:orderId/ready', (req, response) => {
    const {orderId} = req.params;

    getPhoneForOrder(db, orderId).then(res => {
      const phone = res.rows[0].phone;
      const msg = 'Your order is ready to be picked up!';
      console.log(`Sent '${msg}' to ${phone}!`);
      /* KEEP! sms functionality to be uncommented*/
      // sendSms(msg, phone);
    }

    );

    setOrderStatus(db, orderId, 'ready').then(
      response.redirect('/kitchen')
    ).catch((err) => {
      console.log(err);
      response.status(500).send(err);
    });
  });

  return router;
};
