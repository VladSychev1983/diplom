import React from "react";
import { Link } from "react-router-dom";

function Home()  {
return (
<React.Fragment>
    <div>
  <h1>Добро пожаловать в облачное хранилище файлов.</h1>
  <div style={{textAlign:"center", fontSize:25, lineHeight:2.5}}>
Данное приложение позволяет сохранять файлы и обмениваться публичными ссылкам на загруженные файлы.
<br />
Пожалуйста,  <Link to='/register'>зарегистрируйтесь</Link> или  <Link to='/login'>авторизуйтесь.</Link>
<br />
Приятного использования и отличного настроения!
</div>
<div className="footer">
  Все права защищены. <br />
Разработано Sychev Vladislav  <br />
  2025
</div>
    </div>
    {/* <Counter /> */}
</React.Fragment>
);

}

export default Home;