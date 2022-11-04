/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ProductList from "../product/productList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getBusinesDetails } from "../../redux/actions/authActions";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getBusinesDetails(user?.usuario?.empresa?.idempresa));
  }, []);

  return <ProductList />;
}
