import React from "react";
import { useSelector } from "react-redux";

function UserProfileHeader() {
//получаем данные из redux.
const userData = useSelector((state) => state.user?.userData);
const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

//если пользователь не аутентифицирован или данные в redux отсутствуют.
if (!isAuthenticated || !userData) {
    return (
        <React.Fragment>
            <div style={{marginBottom: 10}}>Войдите в аккаунт или зарегистрируйтесь.</div>
        </React.Fragment>
    )
}
//выводим профиль аутентифицированного пользователя.
    return (
        <React.Fragment>
            <div>
                <h3>
                    Добро пожаловать, {userData.first_name || userData.username }
                </h3>
                <p>
                    Ваш email: {userData.email}
                </p>
                {/* { если пользователь администратор.} */}
                {userData.is_superuser && <p>Вы администратор системы.</p>}
            </div>
        </React.Fragment>
    )
}
export default UserProfileHeader;