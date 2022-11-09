import { gql, useQuery } from "@apollo/client";
import Dishes from "./dishes";
import { useContext, useState } from "react";

import AppContext from "./context";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
} from "reactstrap";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

function RestaurantList(props) {
  const [restaurantID, setRestaurantID] = useState(0);
  const [dishesQuery, setDishesQuery] = useState("");
  const { cart } = useContext(AppContext);
  const [state, setState] = useState(cart);
  const router = useRouter();
  const GET_RESTAURANTS = gql`
    query {
      restaurants {
        id
        name
        description
        image {
          url
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_RESTAURANTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;
  console.log(`Query Data: ${data.restaurants}`);

  let searchQuery = data.restaurants.filter((res) => {
    return res.name.toLowerCase().includes(props.search);
  });
  let restId = searchQuery?.[0]?.id;

  // definet renderer for Dishes
  const renderDishes = (restaurantID) => {
    return (
      <Dishes restId={restaurantID} search={dishesQuery}>
        {" "}
      </Dishes>
    );
  };
  if (searchQuery.length > 0) {
    const restList = searchQuery.map((res) => {
      console.log(res.image);
      return (
        <Col xs="6" sm="4" key={res.id}>
          <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
            <CardImg
              top={true}
              style={{ height: 200, objectFit: "cover" }}
              src={
                res.image?.url
                  ? API_URL + res.image.url
                  : `${router.basePath}/generic-restaurant.jpg`
              }
            />
            <CardBody>
              <CardText>{res.description}</CardText>
            </CardBody>
            <div className="card-footer">
              <Button color="info" onClick={() => setRestaurantID(res.id)}>
                {res.name}
              </Button>
            </div>
          </Card>
        </Col>
      );
    });

    return (
      <Container>
        <Row xs="3">{restList}</Row>

        {restaurantID > 0 ? (
          <Row>
            <Col>
              <InputGroup>
                <InputGroupAddon addonType="append">
                  {" "}
                  Search Dishes
                </InputGroupAddon>
                <Input
                  onChange={(e) =>
                    setDishesQuery(e.target.value.toLocaleLowerCase())
                  }
                  value={dishesQuery}
                />
              </InputGroup>
              <br></br>
            </Col>
          </Row>
        ) : null}
        <Row xs="3">{renderDishes(restaurantID)}</Row>
      </Container>
    );
  } else {
    return <h1> No Restaurants Found</h1>;
  }
}
export default RestaurantList;
