import { useEffect, useState } from "react";
import { server } from "../constants/config";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  product: Product;
}

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  phoneNo: number;
}

interface PaymentInfo {
  transactionId: string | null;
  status: string;
}

interface Order {
  _id: string;
  user: User;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const isAdmin = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("rupkala-admin="));
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, []);
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`${server}/api/order/allorders`);
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading orders...
        </Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Completed Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="h6">No completed orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order._id} sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                Order ID: {order._id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ordered on: {new Date(order.createdAt).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Customer Details:</Typography>
              <Typography>
                {order.user.name} ({order.user.email})
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Shipping Address:
              </Typography>
              <Typography>
                {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                {order.shippingInfo.state}, {order.shippingInfo.country} -{" "}
                {order.shippingInfo.pinCode}
              </Typography>
              <Typography>Phone: {order.shippingInfo.phoneNo}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Items Ordered:</Typography>
              <List>
                {order.orderItems.map((item) => (
                  <ListItem key={item.product._id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`${item.name} - ${
                        item.quantity
                      } x $${item.product.price.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Payment Details:</Typography>
              <Typography>
                <strong>Status:</strong> {order.paymentInfo.status}
              </Typography>
              <Typography>
                <strong>Transaction ID:</strong>{" "}
                {order.paymentInfo.transactionId ?? "N/A"}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
