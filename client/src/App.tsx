import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Crea from "@/pages/Crea";
import Rent from "@/pages/Rent";
import Events from "@/pages/Events";
import SKDHome from "@/pages/SKDHome";
import Co from "@/pages/Co";
import Checkout from "@/pages/Checkout";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Themes from "@/pages/Themes";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProducts from "@/pages/AdminProducts";
import AdminAddProduct from "@/pages/AdminAddProduct";
import AdminProductDetail from "@/pages/AdminProductDetail";
import AdminEditProduct from "@/pages/AdminEditProduct";
import AdminOrders from "@/pages/AdminOrders";
import AdminRentals from "@/pages/AdminRentals";
import AdminQuotes from "@/pages/AdminQuotes";
import AdminUsers from "@/pages/AdminUsers";
import ProductDetail from "@/pages/ProductDetail";
import Orders from "@/pages/Orders";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancel from "@/pages/PaymentCancel";
import CartPage from "@/pages/CartPage";
import Invoice from "@/pages/Invoice";
import RentalDetail from "@/pages/RentalDetail";
import RentalSuccess from "@/pages/RentalSuccess";
import RentalCancel from "@/pages/RentalCancel";
import RentalInvoice from "@/pages/RentalInvoice";
import UnifiedSuccess from "@/pages/UnifiedSuccess";
import Realisations from "@/pages/Realisations";
import ProductCustomizationDemo from "@/pages/ProductCustomizationDemo";
import TestCustomization from "@/pages/TestCustomization";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't wait for authentication - show content immediately
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/rental/success" component={UnifiedSuccess} />
      <Route path="/rental/cancel" component={RentalCancel} />
      <Route path="/rental/invoice/:rentalId" component={RentalInvoice} />
      <Route path="/rental/:id" component={RentalDetail} />
      <Route path="/cart" component={CartPage} />
      <Route path="/crea" component={Crea} />
      <Route path="/rent" component={Rent} />
      <Route path="/events" component={Events} />
      <Route path="/home" component={SKDHome} />
      <Route path="/co" component={Co} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/realisations" component={Realisations} />
      <Route path="/demo-customization" component={ProductCustomizationDemo} />
      <Route path="/test-customization" component={TestCustomization} />
      <Route path="/orders" component={Orders} />
      <Route path="/invoice/:orderId" component={Invoice} />
      <Route path="/payment/success" component={UnifiedSuccess} />
      <Route path="/payment/cancel" component={PaymentCancel} />
      <Route path="/themes" component={Themes} />
             <Route path="/admin/login" component={AdminLogin} />
             <Route path="/admin/dashboard" component={AdminDashboard} />
             <Route path="/admin/products" component={AdminProducts} />
             <Route path="/admin/products/add" component={AdminAddProduct} />
             <Route path="/admin/products/:id" component={AdminProductDetail} />
             <Route path="/admin/products/:id/edit" component={AdminEditProduct} />
             <Route path="/admin/orders" component={AdminOrders} />
             <Route path="/admin/rentals" component={AdminRentals} />
             <Route path="/admin/quotes" component={AdminQuotes} />
             <Route path="/admin/users" component={AdminUsers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
