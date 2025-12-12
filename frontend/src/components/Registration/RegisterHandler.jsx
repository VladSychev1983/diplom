import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/userReducer";

function RegisterHandler ({formData, sendRequest, setSendRequest, signUP}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                //обьект ответа от django получаем в json.
                const response = await signUP(formData);
                const result = await response.json();
                if(!response.ok) {
                    setError(Object.values(result.error || result));
                    setIsLoading(false);
                    return 
                }
                //если ответ успешный сохраняем data в redux.
                dispatch(setUser(result.data))
                setIsLoading(false)
                setSendRequest(false)
                //отправляем пользователя а файлы.
                navigate('/');
            }
            catch(err) {
                console.log(err)
                setError(["Произошла ошибка сети."])
        
            } finally {
                setIsLoading(false)
                //сбрасываем триггер в false.
                if(sendRequest) {
                    setSendRequest(false)
                }
            }
        };

        if(sendRequest) {
            fetchData();
        }
    }, [sendRequest, dispatch, formData, navigate, setSendRequest, signUP]);

    //если идет загрузка показываем спиннер или текст загрузка.
    if(isLoading) {
    return (
        <React.Fragment>
            <div style={{ padding: '10px', textAlign: 'center' }}>
                <p>Регистрация..</p>
            </div>

        </React.Fragment>
    );
            }
    if (error && error.length > 0) {
        return (
            <React.Fragment>
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '10px 0' }}>
        <strong>Ошибка регистрации:</strong>
        <ul>
          {error.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      </React.Fragment>
        )
    }
    
}
export default RegisterHandler;