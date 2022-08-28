import React, { useContext, useState } from "react";
import { Context } from "..";
import { Row, Col, Container, Form, InputGroup, Stack, Button } from "react-bootstrap";
import FormRange from "react-bootstrap/esm/FormRange";

const SearchBar = ({onParamsChange, params }) => {
    const { flower } = useContext(Context)

    const minFlowerPrice = 0
    const maxFlowerPrice = flower.maxPrice
    
    const [search, setSearchParams] = useState( { 
        minPrice: params.minPrice || 0, 
        maxPrice: flower.maxPrice, 
        tags: params.tags 
    })

    const setMinPrice = (value) => {
        search.minPrice = value

        setSearchParams({ 
            minPrice: search.minPrice, 
            maxPrice: search.maxPrice, 
            tags: search.tags 
        })
    }

    const setMaxPrice = (value) => {
        search.maxPrice = value

        setSearchParams({ 
            minPrice: search.minPrice, 
            maxPrice: search.maxPrice, 
            tags: search.tags 
        })
    }

    const switchTag = (tag) => {
        if (search.tags.some(tg => tg.id === tag.id)) {
            search.tags = search.tags.filter(searchTag => tag.id !== searchTag.id)

            setSearchParams({ 
                minPrice: search.minPrice, 
                maxPrice: search.maxPrice, 
                tags: search.tags 
            })
        } else {
            search.tags = search.tags.concat(tag)

            setSearchParams({ 
                minPrice: search.minPrice, 
                maxPrice: search.maxPrice, 
                tags: search.tags 
            })
        }
    }

    const confirm = () => {
        console.log(search)
        onParamsChange(search)
    }

    return (
        <Container className="tag-bar">
            <div style={{fontWeight:"bold", fontSize:20, textAlign:"center"}}>
                Параметры поиска
            </div>
            <Stack>
                <Col style={{width:"100%", marginBottom:5}}>
                    <div style={{paddingLeft:5, fontWeight:"bold", marginBottom:4}}>
                        Выберите тэги
                    </div>
                    <Row className="d-flex" style={{marginLeft:0, marginRight:0,}}>
                        { flower.tags.map(tag =>
                            <Col xs={"auto"} key={tag.id} style={{paddingLeft:0, paddingRight:3, marginBottom:3}} 
                                onClick={() => switchTag(tag)}>
                                <div className={"tag" + (search.tags.some(tg => tg.id === tag.id) ? " tag-active" : "")}>
                                    {tag.name}
                                </div>
                            </Col>
                        )}
                    </Row>
                </Col>

                <Col style={{marginBottom:8, borderTop: "1px dotted #aaa"}}>
                    <Form.Label style={{fontWeight:"bold", margin:0}}>
                        Максимальная цена
                    </Form.Label>

                    <FormRange min={search.minPrice + 50} max={maxFlowerPrice} value={search.maxPrice} onChange={e => { setMaxPrice(Math.round(e.target.value / 50) * 50) }}/>

                    <InputGroup>
                        <InputGroup.Text style={{height:30}}> {search.minPrice + 50} </InputGroup.Text>

                        <Form.Control style={{height:30}} 
                            type="number" 
                            value={search.maxPrice} 
                            onChange={e => { setMaxPrice(Math.min(Math.max(e.target.value, minFlowerPrice), maxFlowerPrice)) }}
                        />
                        
                        <InputGroup.Text style={{height:30}}> {maxFlowerPrice} </InputGroup.Text>
                    </InputGroup>
                </Col>
                
                <Col style={{marginBottom:5, borderTop: "1px dotted #aaa"}}>
                    <Form.Label style={{fontWeight:"bold", margin:0}}>
                        Минимальная цена
                    </Form.Label>

                    <FormRange min={minFlowerPrice} max={Math.max(search.maxPrice - 50, minFlowerPrice)} value={search.minPrice} onChange={e => { setMinPrice(Math.round(e.target.value / 50) * 50) }}/>

                    <InputGroup>
                        <InputGroup.Text style={{height:30}}> {minFlowerPrice} </InputGroup.Text>

                        <Form.Control style={{height:30}} 
                            type="number" 
                            value={search.minPrice} 
                            onChange={e => { setMinPrice(Math.min(Math.max(e.target.value, minFlowerPrice), search.maxPrice)) }}
                        />
                        
                        <InputGroup.Text style={{height:30}}> {Math.max(search.maxPrice - 50, minFlowerPrice)} </InputGroup.Text>
                    </InputGroup>
                </Col>

                <Col style={{borderTop: "1px dotted #aaa"}}>
                    <Button style={{ float:"right", marginTop: 5 }} onClick={confirm}>
                        Найти
                    </Button>
                </Col>
            </Stack>
        </Container>
    );
}

export default SearchBar