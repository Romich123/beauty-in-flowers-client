import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Row } from "react-bootstrap";
import { Context } from "..";
import useWindowDimensions from "../hooks/useWindowDimentions";
import FlowerItem from "./FlowerItem";

const FlowerList = observer(() => {
    const { flower } = useContext(Context)

    const { width } = useWindowDimensions()

    const columns = width >= 1200 ? 4 : width >= 767 ? 3 : width >= 450 ? 2 : 1

    return (
        <Row className={`d-flex  row-cols-${columns}`}>
            {flower.flowers.map(flower => 
                <FlowerItem key={flower.id} flower={flower}/>
            )}
        </Row>
    );
})

export default FlowerList