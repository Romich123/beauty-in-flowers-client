import { AxiosError } from "axios";
import React, { useContext, useEffect } from "react";
import { Col, Row, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "..";
import { getFlowers } from "../http/flowerApi";
import { FLOWER_ROUTE } from "../utils/consts";

const MiniFlowerList = ({tags, flowerExclude}) => {
    const { flower, loading } = useContext(Context)
    const navigate = useNavigate()
    
    useEffect(() => {
        const loadedOne = () => {
            loading.removeLoadingOperation()
        }

        loading.addLoadingOperation()

        const loadFlowers = () => {
            getFlowers(tags).then(data => {
                loadedOne()

                if (data instanceof AxiosError) {
                    loadFlowers()
                    return
                }
                
                if (flowerExclude) {
                    data.rows = data.rows.filter(flower => flower.id !== flowerExclude.id)
                }
    
                flower.setFlowers(data.rows); 
                flower.setFlowersCount(data.count) 
            })
        }

        loadFlowers()
    }, [tags, flower, flowerExclude, loading])

    return (
        <Row xs={2} sm={2} md={6} lg={8}>
            {flower.flowers.slice(0, 6).map((flower, index) => 
                <Col key={index} style={{ minWidth: 150, marginBottom: 10, marginTop: 0}} onClick={() => navigate(FLOWER_ROUTE + '/' + flower.id)}>
                    <Card style={{margin: 0, cursor: 'pointer'}} border={"light"}>
                        <Image width={"100%"} style={{aspectRatio: 3/4, borderRadius: 5, marginBottom: 7}} src={process.env.REACT_APP_API_URL + flower.previewImg}/>
                        
                        <div style={{marginBottom: 4, marginLeft: 10}}>
                            <div style={{display:"inline", fontWeight: "bold"}}>
                                {flower.price + "₽"}
                            </div>

                            <div style={{display:"inline", marginLeft: 5, color: "gray", textDecoration: "line-through"}}>
                                {flower.price * 1.2 + "₽"}
                            </div>
                            
                            <div style={{ color: "gray"}}>
                                {flower.name}
                            </div>
                        </div>
                    </Card>
                </Col>
            )}
        </Row>
    );
}

export default MiniFlowerList