import React, { useState } from "react";
import { signUP, get_csrf_token } from "../../apiService/requests";
import RegisterHandler from "./RegisterHandler";

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  //данный стейт используем для useEffect в RegistrationComponent
  const [sendRequest, setSendRequest] = useState(false)

  const handlerChange = (e) => {
    //записываем в состояние данные формы.
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlerSubmit = (e) => {
    e.preventDefault();
    //вызываем useEffect в RegisterComponent.
    setSendRequest(true)
  }

    return (
        <React.Fragment>
            <div className="registration_form_container">
      <h1>Регистрация</h1>
      <form onSubmit={handlerSubmit} className="login_form" >
        <div className="form_group">
        <label htmlFor="username">Пользователь</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handlerChange} required/>
        <br />
        </div>
        <div className="form_group">
        <label htmlFor="email">Почта Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handlerChange} required/>
        </div>
        <br />
        <div className="form_group">
        <label htmlFor="password">Пароль</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handlerChange} required/>
        <br />
        </div>
        <div className="form_group">
        <label htmlFor="first_name">Ваше имя</label>
        <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handlerChange} required />
        <br />
        </div>
         <div className="form_group">
          <label htmlFor="last_name">Ваша фамилия:</label>
        <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handlerChange} required />
        <br />
        </div>
        <button type="submit" className="login_form_submit">Зарегистрироваться</button>
      </form>
    </div>
    {/* {передаем данные формы и триггер в компонент обработчик RegisterHandler  } */}
    <RegisterHandler formData={formData} sendRequest={sendRequest}
    // передаем также функцию которя сбросит триггер.
    setSendRequest={setSendRequest}
    signUP={signUP}
    get_csrf_token={get_csrf_token}> 
    </RegisterHandler>
        </React.Fragment>
    )
}

export default RegisterForm;