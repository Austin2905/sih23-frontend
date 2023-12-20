import { useEffect, useState } from "react";
import Axios from "axios";
import "./personalityQuestions.css";

const PersonalityQuestions = ({user, setUser, setIsShow}) => {

    const [questions, setQuestions] = useState([]);
    const [answer, setAnswer] = useState("");

    useEffect(() => {
        Axios.get('/question/personality')
            .then((response) => {
                console.log(response.data);
                setQuestions(response.data.qns);
            })
    }, [])

    function findDuplicateCharacters(inputString) {
        let charCount = {};
        let result = '';
    
        // Count occurrences of each character
        for (let char of inputString) {
            charCount[char] = (charCount[char] || 0) + 1;
        }
    
        // Append characters that appear more than once in order
        for (let char of inputString) {
            if (charCount[char] > 1 && !result.includes(char)) {
                result += char;
            }
        }
    
        return result;
    }


    const handleSubmit = () => {
        const result = findDuplicateCharacters(answer);
        console.log(result);
        Axios.post('/question/personality', {personality: result, user: user})
        .then((response) => {
            console.log(response.data);
            // setUser({...user, personality: result})
            setIsShow(true);
        })
    }
    console.log(answer);
    return (
        <div className="personality-questions-container">
            {questions.map((question) => {
                return (
                    <div key={question._id} className="personality-question">
                        <h2>{question.question}</h2>
                        <div className="image-container">
                            <div className="q-card" onClick={(e) => {
                                setAnswer(ans => ans + question.personality[0]);
                                console.log(e.currentTarget)
                                e.currentTarget.classList.add("selected");
                            }}>
                                <img src={question.images[0]} />
                                <span>{question.options[0]}</span>
                            </div>
                            <div className="q-card" onClick={(e) => {
                                setAnswer(ans => ans + question.personality[1])
                                e.currentTarget.classList.add("selected");
                            }}>
                                <img src={question.images[1]} />
                                <span>{question.options[1]}</span>
                            </div>

                        </div>
                    </div>
                )
            })}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default PersonalityQuestions;