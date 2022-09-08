import { AxiosError } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import { Context } from "..";
import FlowerList from "../components/FlowerList";
import SearchBar from "../components/SearchBar";
import { getFlowers, getTags } from "../http/flowerApi";

const Shop = () => {
    const { flower, loading } = useContext(Context)

    const [activePage, setActivePage] = useState(1)

    const [searchParams, setSearchParams] = useState({minPrice: 0, maxPrice: undefined, tags: []})

    const flowersOnPage = 48
    const pageCount = Math.ceil(flower.flowersCount / flowersOnPage)
    const pages = []

    if (pageCount > 1) {
        for (let i = 0; i < pageCount; i++) {
            pages.push(i + 1)
        }
    }

    useEffect(() => {
        const loadedOne = () => {
            loading.removeLoadingOperation()
        }

        loading.addLoadingOperation()
        loading.addLoadingOperation()

        const loadTags = () => {
            getTags().then(data => {
                if (data instanceof AxiosError) {
                    loadTags()
                    return
                }
    
                flower.setTags(data)
                loadedOne()
            })
        }

        const loadFlowers = () => {
            getFlowers(searchParams.tags, activePage, flowersOnPage, searchParams.minPrice, searchParams.maxPrice).then(data => { 
                if (data instanceof AxiosError) {
                    loadFlowers()
                    return
                }

                if (data == null) {
                    loadFlowers()
                    return
                }
    
                console.log(data.rows)
                flower.setFlowers(data.rows.reverse())
                flower.setFlowersCount(data.count)
                flower.setMaxPrice(Math.max(...data.rows.map(flower => flower.price)))
                loadedOne()
            })
        }

        loadTags()
        loadFlowers()
    }, [searchParams, activePage, flower, loading])


    return (
        <Container>
            <Row className="mt-4">
                <Col md={12} lg={3}>
                    <SearchBar params={searchParams} onParamsChange={setSearchParams}/>
                </Col>
                <Col sm={12} lg={9}>
                    <FlowerList/>
                    <Pagination>
                        {pages.map((page) => 
                            <Pagination.Item key={page} active={page === activePage} onClick={() => setActivePage(page)}>
                                {page}
                            </Pagination.Item>
                        )}
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
}

export default Shop