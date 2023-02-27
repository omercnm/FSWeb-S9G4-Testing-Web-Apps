import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "../App";

test("hata olmadan render ediliyor", () => {
  render(<App />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const baslik = screen.getByText(/İletişim Formu/i);
  expect(baslik).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const isimInput = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimInput, "Yeah");
  const isimHata = screen.getByTestId("error");
  expect(isimHata).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByPlaceholderText(/İlhan/i);

  const soyadInput = screen.getByPlaceholderText(/Mansız/i);

  const emailInput = screen.getByPlaceholderText(
    /yüzyılıngolcüsü@hotmail.com/i
  );
  userEvent.type(adInput, "m");

  userEvent.type(soyadInput, "m");
  userEvent.clear(soyadInput);

  userEvent.type(emailInput, "m");

  const hatalarTesti = await screen.getAllByTestId("error");
  expect(hatalarTesti.length).toEqual(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const isimInput = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimInput, "ÖmerCan");

  const soyİsimInput = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(soyİsimInput, "Canım");

  const submitButton = screen.getAllByRole("button");
  userEvent.click(submitButton[0]);

  const mailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(mailInput, "");
  const errorText = screen.getByTestId("error");
  expect(errorText).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(email, "Eyy");
  const errorText = screen.getByTestId("error");
  expect(errorText).toHaveTextContent(
    "email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const inputA = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(inputA, "İlhan");
  const inputM = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(inputM, "yüzyılıngolcüsü@hotmail.com");
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("error")).toBeVisible();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const isimInput = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimInput, "ÖmerCan");

  const soyİsimInput = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(soyİsimInput, "Canım");

  const mailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(mailInput, "yüzyılıngolcüsü@hotmail.com");

  const submitButton = screen.getByText(/Gönder/);
  userEvent.click(submitButton);
  await waitFor(() => {
    const errorDiv = screen.queryAllByTestId("error");
    expect(errorDiv.length).toBe(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Ahmet");
  userEvent.type(screen.getByPlaceholderText("Mansız"), "Developer");
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "ahmet@developer.com"
  );
  userEvent.type(screen.getByText("Mesaj"), "ödev tamamlandı");
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("firstnameDisplay")).toHaveTextContent(
    "Ahmet"
  );
  expect(await screen.findByTestId("lastnameDisplay")).toHaveTextContent(
    "Developer"
  );
  expect(await screen.findByTestId("emailDisplay")).toHaveTextContent(
    "ahmet@developer.com"
  );
  expect(await screen.findByTestId("messageDisplay")).toHaveTextContent(
    "ödev tamamlandı"
  );
});
