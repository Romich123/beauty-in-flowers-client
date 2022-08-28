import React from "react";
import { Card, Col, Image } from "react-bootstrap";
import { FLOWER_ROUTE } from "../utils/consts";
import { useNavigate } from 'react-router-dom';

const FlowerItem = ({flower}) => {
    const navigate = useNavigate()
    
    const formatPrice = (price) => {
        return (price + "").split("").reverse().join("").replace(/(\d{3})/g, "$1 ").split("").reverse().join("").replace(/^ /, "") + " ₽"
    }

    return (
        <Col style={{ marginBottom: 10, marginTop: 0}} onClick={() => navigate(FLOWER_ROUTE + '/' + flower.id)}>
            <Card style={{margin: 0, cursor: 'pointer'}} border={"light"}>
                <Image width={"100%"} style={{aspectRatio: 3/4, borderRadius: 5, marginBottom: 7}} src={process.env.REACT_APP_API_URL + flower.previewImg}/>
                
                <div style={{marginBottom: 4, marginLeft: 10}}>
                   <div style={{display:"inline", fontWeight: "bold"}}>
                        {formatPrice(flower.price)}
                    </div>
                   <div style={{display:"inline", marginLeft: 5, color: "gray", textDecoration: "line-through"}}>
                        {formatPrice((flower.price * 1.2).toFixed(0))}
                    </div>
                    <div style={{ color: "gray"}}>
                        {flower.name}
                    </div>
                </div>
            </Card>
        </Col>
    );
}

export default FlowerItem