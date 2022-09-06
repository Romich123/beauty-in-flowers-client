import React, { useContext, useEffect, useState } from "react";
import { Container, Col, Image, Row, ListGroup, Button, Carousel, Form, Stack, CloseButton } from "react-bootstrap";
import { Context } from "..";
import starEmpty from "../assets/starEmpty.png";
import starFull from "../assets/starFull.png";
import { useNavigate, useParams } from "react-router-dom";
import { getOneFlower } from "../http/flowerApi";
import MiniFlowerList from "../components/MiniFlowerList";
import { addToBasket, sendFeedBack, deleteFeedback } from "../http/userApi";
import { BASKET_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { AxiosError } from "axios";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import ConfirmModal from "../components/modals/ConfirmModal";

const FlowerPage = () => {
    const { user, loading } = useContext(Context)
    const {id} = useParams()
    const navigate = useNavigate()

    const [displayFlower, setDisplayFlower] = useState({flower_imgs: [], tags: [], feedbacks: [] })
    const [addedToBasket, setAddedToBasket] = useState(false)
    const [userTempRating, setUserTempRating] = useState({rating: 5, confirmed: false})
    const [comment, setComment] = useState("")
    const [imgIndex, setImgIndex] = useState(0)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        const loadedOne = () => {
            loading.removeLoadingOperation()
        }

        const loadFlower = () => {
            loading.addLoadingOperation()

            getOneFlower(id).then(data => {
                loadedOne()

                if (data instanceof AxiosError || !data) {
                    console.log(data)
                    navigate(SHOP_ROUTE)
                    return
                }

                setDisplayFlower(data)
                setImgIndex(0)
            }).catch(e => {
                navigate(SHOP_ROUTE)
            })
        }

        loadFlower()
    }, [id, loading])
    
    const formatSoldCount = (sold) => {
        const start = "Купили "

        const end = sold % 10 <= 1 || sold % 10 >= 5 ? ' раз' : ' раза'

        return  sold > 0 ? start + abbrNum(sold, 1) + end : 'Будьте первым, кто купит!'
    }

    const formatRating = (rating) => {
        if (rating === 0) {
            return ""
        } else {
            return rating.toFixed(1)
        }
    }

    const abbrNum = (n,d) =>
    {
        let x=(''+n).length
        d = Math.pow(10, d)
        x -= x % 3
        return Math.round( n * d / Math.pow(10,x))/d+" kMGTPE"[x/3]
    }

    const formatPrice = (price) => {
        return (price + "").split("").reverse().join("").replace(/(\d{3})/g, "$1 ").split("").reverse().join("").replace(/^ /, "") + " ₽"
    }
    
    let tagsWithDesciption = []
    let tagsWithoutDesciption = []

    if (displayFlower.tags)
    {
        tagsWithDesciption = displayFlower.tags.filter(tag => tag.description != null && tag.description !== "")
        tagsWithoutDesciption = displayFlower.tags.filter(tag => tag.description == null || tag.description === "").sort((tag1, tag2) => tag2.name.length - tag1.name.length)
    }

    const fullStars = Math.round(displayFlower.rating)
    const array = [1, 2, 3, 4, 5]

    const isUserDeliveredDisplayFlower = user.deliveredFlowers.some(deliveredFlower => deliveredFlower.flowerId === displayFlower.id)

    const confirmComment = () => {
        sendFeedBack(userTempRating.rating, comment, displayFlower.id)
        displayFlower.feedbacks = displayFlower.feedbacks.concat({rating: userTempRating.rating, comment: comment, userId: user.user.id, flowerId: displayFlower.id, updatedAt: new Date()})
        setDisplayFlower(Object.assign({}, displayFlower))
    }

    const deleteComment = () => {
        deleteFeedback(displayFlower.id)
        displayFlower.feedbacks = displayFlower.feedbacks.filter(feedback => feedback.userId !== user.user.id)
        setDisplayFlower(Object.assign({}, displayFlower))
    }

    const usersFeedback = displayFlower.feedbacks.filter(feedback => feedback.userId === user.user.id)[0]

    const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря" 
    ]

    const formatDate = (date) => {
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
    }

    return (
        <Container className="mt-3">
            <div style={{marginBottom: 4}}>
                <div style={{marginBottom: 4}}> 
                    <span style={{display:"inline", fontSize: 30, fontWeight: "bold"}}>
                        Букет / 
                    </span>

                    <h2 style={{display:"inline", fontSize: 30, fontWeight: "bold"}}>
                        {' ' + displayFlower.name}
                    </h2>
                </div>
                <Row className="row-cols-xs-2" style={{height:30}}>
                    
                    {displayFlower.rating > 0 ?
                        <Col xs="auto" style={{width: 45, height: 18, color:"gray", fontWeight:"bold", fontSize: 20, verticalAlign:"center"}}>
                            {formatRating(displayFlower.rating)}
                        </Col>
                        :
                        <Col xs="auto"></Col>
                    }

                    <Col xs="auto" style={{paddingLeft:4}}>
                        <Row style={{marginTop:2}}>
                            <Col xs="auto" style={{paddingRight:0}}>
                                <Row className="row-cols-md-5" style={{width: 120}}>
                                    {array.map(i =>
                                        <Col key={i} md="auto" style={{width:18, paddingRigth:0, paddingLeft:8}}>
                                            <Image width={18} style={{aspectRatio: 1, width: 18}} src={i <= fullStars ? starFull : starEmpty}/>
                                        </Col>
                                    )}
                                </Row>
                            </Col>

                            <Col xs="auto" style={{color:"gray", paddingTop:2}}>
                                {formatSoldCount(displayFlower.sold)}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <Row className="d-flex row-cols-xs-3">
                <Col style={{minWidth:450, maxWidth:600}}>
                    <Carousel style={{width: "100%"}} activeIndex={imgIndex} onSelect={(index, e) => setImgIndex(index)}>
                        {displayFlower.flower_imgs.map((img, index) => 
                            <Carousel.Item key={index}>
                                <Image width={"100%"} style={{aspectRatio: 3/4, borderRadius: 10}} src={process.env.REACT_APP_API_URL + img.img} alt="Картинка"/>
                            </Carousel.Item>
                        )}
                    </Carousel>
                </Col>

                <Col className="container" style={{marginLeft: 0, minWidth: 250}}>
                    <h3 style={{fontWeight:"bold"}}>
                        О букете
                    </h3>
                    
                    <ListGroup className="mb-1">
                        {tagsWithDesciption.map(tag =>
                            <ListGroup.Item className="pb-2 mb-2" key={tag.id} style={{borderTop: 0, borderLeft: 0, borderRight: 0, borderBottom: "1px dotted #ccc", padding: 0 }}>
                                <div>
                                    <div className="tag not-active mr-3">
                                            {tag.name}
                                    </div>
                                    { " - " + tag.description}
                                </div>
                            </ListGroup.Item>
                        )}
                    </ListGroup>

                    <div>
                        <Row style={{margin: 0}}>
                            {tagsWithoutDesciption.map(tag =>
                                <Col xs={"auto"} key={tag.id} style={{paddingLeft:0, paddingRight:3}}>
                                    <div className="tag not-active mr-3">
                                            {tag.name}
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </div>
                </Col>

                <Col className="pt-2">
                    <Container className="add-basket-card" style={{paddingTop:10, paddingBottom:10}}>
                        <div>
                            <div style={{fontSize: 23, fontWeight: "bold"}}>
                                {formatPrice(displayFlower.price)}
                            </div>

                            <div style={{color:"gray"}}>
                                Цена доставки будет расчитана при оплате.
                            </div>
                        </div>

                        <div>
                            {user.isAuth ?
                                !addedToBasket ?
                                <Button className="mt-2" variant={"success"} style={{width:"100%"}} onClick={() => { addToBasket(displayFlower); setAddedToBasket(true)}}>
                                    Добавить в корзину
                                </Button>
                                :
                                <Button className="mt-2" active={false} variant={"outline-success"} style={{width:"100%"}} onClick={() => navigate(BASKET_ROUTE)}>
                                    Перейти в корзину
                                </Button>
                                :
                                <Button className="mt-2" disabled variant={"outline-success"} style={{width:"100%"}}>
                                    Войдите в аккаунт!
                                </Button>
                            }
                            <div style={{color:"gray", fontSize:13}}>
                                Доставка от 1 часа!
                            </div>
                        </div>
                    </Container>
                </Col>
            </Row>

            <Container style={{paddingBottom:10, paddingTop:10}}>
                <div>
                    <div style={{fontWeight:"bold", fontSize:20}}>
                        Описание
                    </div>
                    <div>
                        {displayFlower.description && displayFlower.description !== "" ? displayFlower.description : "У этого букета нет описания"}
                    </div>
                </div>

                <div className="mb-1">
                    <div style={{fontWeight:"bold", fontSize:20, paddingTop:10}}>
                        Вам может понравиться
                    </div>
                </div>

                <MiniFlowerList tags={displayFlower.rows} flowerExclude={displayFlower}/>
                
                <div className="mb-2">
                    <div style={{marginBottom:10}}>
                        <span style={{fontWeight:"bold", fontSize:20}}>
                            Отзывы
                        </span>

                        <span style={{fontWeight:"bold", fontSize:18, marginLeft:10}}>
                            {displayFlower.feedbacks.length}
                        </span>
                    </div>

                    <Row>
                        <Col xs={12}>
                            <AliceCarousel
                            disableButtonsControls
                            disableDotsControls
                            playButtonEnabled
                            mouseTracking
                            arrows={false}
                            responsive={{
                                0: {
                                    items: 1,
                                },
                                991: {
                                    items: 2
                                },
                                1199: {
                                    items: 3
                                }
                            }}
                            items={[
                            usersFeedback ?
                                <div className="p-2">
                                    <Container className="p-3 comment-card" style={{height:211}}>
                                        <Stack>
                                            <Row>
                                                <Col style={{paddingRight:0}}>
                                                    <span style={{fontWeight:"bold"}}>
                                                        Клиент #{usersFeedback.userId} (вы)
                                                    </span>

                                                    <span style={{marginLeft:7, color:"gray"}}>
                                                        {" " + formatDate(new Date(usersFeedback.updatedAt))}
                                                    </span>
                                                </Col>

                                                <Col xs="auto" style={{paddingRight:6, paddingLeft:0}}>
                                                    <CloseButton style={{marginLeft:"auto", marginRight:0}} onClick={() => setShowDeleteConfirm(true)}/>
                                                </Col>
                                            </Row>
                                            
                                            <div>
                                                <Row>
                                                    <Col xs={"auto"} style={{fontWeight:"bold", fontSize:17, paddingRight:4, paddingTop:2}}>
                                                        {usersFeedback.rating}
                                                    </Col>

                                                    {array.map(i =>
                                                        <Col key={i} md="auto" style={{width:17, paddingRight:0, paddingLeft:0, marginLeft:2}}>
                                                            <Image width={20} style={{aspectRatio: 1, width: 17}} src={i <= usersFeedback.rating ? starFull : starEmpty}/>
                                                        </Col>
                                                    )}
                                                </Row>
                                            </div>

                                            <div style={{marginTop:10}}>
                                                {usersFeedback.comment === "" ? 
                                                    ["Ужасный букет!", "Плохой букет", "Букет на любителя", "Отличный букет", "Прекрасный букет!"][usersFeedback.rating - 1] 
                                                    : 
                                                    usersFeedback.comment
                                                }
                                            </div>
                                        </Stack>
                                    </Container>
                                </div>
                                :
                                <div className="p-2">
                                    <Container className="py-4 px-4 comment-card">
                                        <Row style={{width:"100%", marginBottom:7}}>
                                            <Col style={{fontWeight:"bold"}}>
                                                Ваша оценка:
                                            </Col>

                                            {array.map(i =>
                                                <Col key={i} md="auto" style={{width:20, paddingRigth:0, paddingLeft:10}}>
                                                    <Image width={20} style={{aspectRatio: 1, width: 20}} src={i <= userTempRating.rating ? starFull : starEmpty}
                                                        onMouseEnter={() => !userTempRating.confirmed ? setUserTempRating({rating: i, confirmed: false}) : () => {}}
                                                        onClick={() => setUserTempRating({rating: i, confirmed: true})}
                                                        />
                                                </Col>
                                            )}
                                        </Row>

                                        <Form.Control className="mt-2" as="textarea" rows="3" placeholder={
                                            isUserDeliveredDisplayFlower ?
                                            "Ваш комментарий (Можете оставить пустым)"
                                            :
                                            "Вы сможете оставить отзыв, когда закажите и получите букет!"}
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                            style={{ minHeight:86, maxHeight:86 }}
                                            disabled={!isUserDeliveredDisplayFlower}
                                            />

                                        <Button className="align-self-end mt-2" variant="success" disabled={!isUserDeliveredDisplayFlower} onClick={() => confirmComment()}> Отправить </Button>
                                    </Container>
                                </div>
                            ].concat(
                            displayFlower.feedbacks.filter(feedback => feedback.userId !== user.user.id).map((feedback, index) =>
                                <Col key={index} className="p-2">
                                    <Container className="p-3 comment-card" style={{height:211}}>
                                        <Stack>
                                            <div>
                                                <span style={{fontWeight:"bold"}}>
                                                    Клиент #{feedback.userId}
                                                </span>

                                                <span style={{marginLeft:7, color:"gray"}}>
                                                    {" " + formatDate(new Date(feedback.updatedAt))}
                                                </span>
                                            </div>
                                            
                                            <div>
                                                <Row>
                                                    <Col xs={"auto"} style={{fontWeight:"bold", fontSize:17, paddingRight:4, paddingTop:2}}>
                                                        {feedback.rating}
                                                    </Col>

                                                    {array.map(i =>
                                                        <Col key={i} md="auto" style={{width:17, paddingRight:0, paddingLeft:0, marginLeft:2}}>
                                                            <Image width={20} style={{aspectRatio: 1, width: 17}} src={i <= feedback.rating ? starFull : starEmpty}/>
                                                        </Col>
                                                    )}
                                                </Row>
                                            </div>

                                            <div style={{marginTop:10}}>
                                                {feedback.comment === "" ? 
                                                    ["Ужасный букет!", "Плохой букет", "Букет на любителя", "Отличный букет", "Прекрасный букет!"][feedback.rating - 1] 
                                                    : 
                                                    feedback.comment
                                                }
                                            </div>
                                        </Stack>
                                    </Container>
                                </Col>)
                            )}/>
                        </Col>
                    </Row>
                </div>
            </Container>

            <ConfirmModal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} onConfirmed={() => deleteComment()} onCanceled={() => {}} message={"Вы действительно хотите удалить свой комментарий?"}/>
        </Container>
    );
}

export default FlowerPage