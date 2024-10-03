import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        background: "#fffbeb", // Amber 50
      },
      tooltip: {
        theme: "light",
      },
      colors: ["#d97706"], // Amber 600
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#78350f"], // Amber 900
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          color: "#92400e", // Amber 800
        },
      },
      grid: {
        borderColor: "#fbbf24", // Amber 400
      },
      markers: {
        size: 5,
        colors: ["#b45309"], // Amber 700
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: "#92400e", // Amber 800
          },
        },
        labels: {
          style: {
            colors: "#92400e", // Amber 800
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales",
          style: {
            color: "#92400e", // Amber 800
          },
        },
        min: 0,
        labels: {
          style: {
            colors: "#92400e", // Amber 800
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: "#92400e", // Amber 800
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="bg-amber-50 min-h-screen">
      <AdminMenu />

      <section className="p-6 xl:pl-20">
        <h1 className="text-3xl mt-9 font-bold text-amber-800 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-lg bg-white shadow-md p-6 border border-amber-200">
            <div className="font-bold rounded-full w-12 h-12 bg-amber-500 text-white text-center flex items-center justify-center mb-4">
              $
            </div>
            <p className="text-amber-700 mb-2">Total Sales</p>
            <h2 className="text-2xl font-bold text-amber-900">
              {isLoading ? <Loader /> : `$${sales.totalSales.toFixed(2)}`}
            </h2>
          </div>
          <div className="rounded-lg bg-white shadow-md p-6 border border-amber-200">
            <div className="font-bold rounded-full w-12 h-12 bg-amber-500 text-white text-center flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-amber-700 mb-2">Total Customers</p>
            <h2 className="text-2xl font-bold text-amber-900">
              {loading ? <Loader /> : customers?.length}
            </h2>
          </div>
          <div className="rounded-lg bg-white shadow-md p-6 border border-amber-200">
            <div className="font-bold rounded-full w-12 h-12 bg-amber-500 text-white text-center flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-amber-700 mb-2">Total Orders</p>
            <h2 className="text-2xl font-bold text-amber-900">
              {loadingTwo ? <Loader /> : orders?.totalOrders}
            </h2>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-amber-200">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="100%"
            height="400"
          />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-amber-800 mb-6">Recent Orders</h2>
          <OrderList />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;