import React, { useState } from "react";
import LoginHandler
 from "./LoginHandler";
 
function Login() {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
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
    <div className="login_form_container">
      <h1>Вход в систему</h1>
      <form onSubmit={handlerSubmit} className="login_form">
        <div  className="form_group">
        <label htmlFor="username">Пользователь:</label>
        <input type="text" id="login_username" name="username" value={formData.username} onChange={handlerChange} required/>
        <br />
        </div>
        <div  className="form_group">
        <label htmlFor="password">Пароль:</label>
        <input type="password"  id="login_password" name="password" value={formData.password} onChange={handlerChange} />
        <br />
        </div>
        <button type="submit" className='login_form_submit'>Войти</button>
      </form>
    </div>
        {/* {передаем данные формы и триггер в компонент обработчик RegisterHandler  } */}
    <LoginHandler formData={formData} sendRequest={sendRequest}
    setSendRequest={setSendRequest}>
    </LoginHandler>
        </React.Fragment>
    )
}

export default Login;