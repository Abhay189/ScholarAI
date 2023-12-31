import {
  Col,
  Container,
  Dropdown,
  Row,
  ButtonGroup,
  Card,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import "../Styles/TrackingPageStyles.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Axios from "axios";
const uuidv4 = require("uuid/v4");

export default function TrackingPage() {
  const [lists, setLists] = useState([
    {
      name: "2019 Hunt",
      jobs: [{ company: "Google" }, { company: "Facebook" }],
    },
    { name: "2020 Hunt", jobs: [{ company: "" }, { company: "" }] },
    { name: "2021 Hunt", jobs: [{ company: "" }, { company: "" }] },
  ]);
  const [currentList, setCurrentList] = useState(lists[0]);

  const [wishListItems, setWishListItems] = useState([]);
  const [appliedItems, setAppliedItems] = useState([]);
  const [interviewItems, setInterviewItems] = useState([]);
  const [offerItems, setOfferItems] = useState([]);
  const [regectedItems, setRegectedItems] = useState([]);
  const [addJobColumn, setAddJobColumn] = useState();

  const [addCompanyValid, setCompanyValid] = useState(false);
  const [addPositionValid, setPositionValid] = useState(false);
  const [addStartDateValid, setStartDateValid] = useState(false);
  const [addLinkValid, setLinkValid] = useState(false);
  const [addDescriptionValid, setDescriptionValid] = useState(false);

  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const [columns, setColumns] = useState({
    1: {
      name: "Wishlist",
      items: wishListItems,
      count: wishListItems.length,
    },
    2: {
      name: "Applied",
      items: appliedItems,
      count: appliedItems.length,
    },
    3: {
      name: "Interview",
      items: interviewItems,
      count: interviewItems.length,
    },
    4: {
      name: "Offer",
      items: offerItems,
      count: offerItems.length,
    },
    5: {
      name: "Rejected",
      items: regectedItems,
      count: regectedItems.length,
    },
  });

  useEffect(() => {
    // Checks for token in storage, indicating signed in.
    // if (localStorage.getItem("token") == null) {
    //   window.location.href = "http://localhost:3000/login";
    // }
    // id: id,
    // companyName: company,
    // position: position,
    // link: link,
    // applicationDate: applicationDate,
    // applicationStatus: applicationStatus,
    // startDate: startDate,
    // description: description,

    getLists();

    // const col = columns["Wishlist"];


  }, []);

  async function getLists() {
    let wishList = [];
    let appliedList = [];
    let interviewList = [];
    let offerList = [];
    let rejectedList = [];
    let list;
    await Axios.get("http://127.0.0.1:5000/api/getLists", {
      params: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res);
        list = res.data[0];
        setLists(res.data);
        list.jobs.forEach((job) => {
          job.id = String(job.id);
          if (job.applicationStatus === "Wishlist") {
            wishList.push(job);
          } else if (job.applicationStatus === "Applied") {
            appliedList.push(job);
          } else if (job.applicationStatus === "Interview") {
            interviewList.push(job);
          } else if (job.applicationStatus === "Offer") {
            offerList.push(job);
          } else if (job.applicationStatus === "Regected") {
            rejectedList.push(job);
          }
          setCurrentList(list);
          setWishListItems(wishList);
          setAppliedItems(appliedList);
          setInterviewItems(interviewList);
          setOfferItems(offerList);
          setRegectedItems(rejectedList);
          setColumnsData(
            wishList,
            appliedList,
            interviewList,
            offerList,
            rejectedList
          );
        });
      })
      .catch((res) => {
        console.log(res);
      });
  }

  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setModalInfo(item);
    setShow(true);
  };

  const handleCloseAdd = () => setShowAdd(false);



  function changeList(list) {
    console.log(list);
    let wishList = [];
    let appliedList = [];
    let interviewList = [];
    let offerList = [];
    let rejectedList = [];

    setCurrentList(list);
    if(list.jobs.length === 0){
      setCurrentList(list);
      setWishListItems(wishList);
      setAppliedItems(appliedList);
      setInterviewItems(interviewList);
      setOfferItems(offerList);
      setRegectedItems(rejectedList);
      setColumnsData(
        wishList,
        appliedList,
        interviewList,
        offerList,
        rejectedList
      );
    }
    list.jobs.forEach((job) => {
      job.id = String(job.id);
      if (job.applicationStatus === "Wishlist") {
        wishList.push(job);
      } else if (job.applicationStatus === "Applied") {
        appliedList.push(job);
      } else if (job.applicationStatus === "Interview") {
        interviewList.push(job);
      } else if (job.applicationStatus === "Offer") {
        offerList.push(job);
      } else if (job.applicationStatus === "Rejected") {
        rejectedList.push(job);
      }
      setCurrentList(list);
      setWishListItems(wishList);
      setAppliedItems(appliedList);
      setInterviewItems(interviewList);
      setOfferItems(offerList);
      setRegectedItems(rejectedList);
      setColumnsData(
        wishList,
        appliedList,
        interviewList,
        offerList,
        rejectedList
      );
      console.log("test");
      console.log(columns)
    });
  }

  function handleOnDragEnd(result) {
    console.log(offerItems);
    if (!result.destination) return;
    const { source, destination } = result;
    let removed = [];
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      [removed] = sourceItems.splice(source.index, 1);
      removed.applicationStatus = destColumn.name;
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
          count: sourceItems.length,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
          count: destItems.length,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }

    Axios.put("http://127.0.0.1:5000/api/updateTrackingList", {
        token: localStorage.getItem("token"),
        listName: currentList.listName,
        listId: currentList.listID,
        jobId: removed.id,
        applicationStatus: removed.applicationStatus,
    })
  }

  function addDummyData() {
    const column = columns["Wishlist"];
    let company = "Google";
    let position = "dev";
    let startDate = "May 2020";
    let link = "google.com";
    let description = "isjfsdkfjsdf";
    let applicationStatus = "WishList";
    let applicationDate = new Date().toDateString();
    let id; //= uuidv4();

    if (company === "") setCompanyValid(true);
    if (position === "") setPositionValid(true);
    if (startDate === "") setStartDateValid(true);
    if (link === "") setLinkValid(true);
    if (description === "") setDescriptionValid(true);

    if (
      company !== "" &&
      position !== "" &&
      startDate !== "" &&
      link !== "" &&
      description !== ""
    ) {
      column.count++;
      handleCloseAdd();
      console.log(currentList)
      Axios.post("http://127.0.0.1:5000/api/addJobToTrack", {
        token: localStorage.getItem("token"),
        companyName: company,
        position: position,
        startDate: startDate,
        link: link,
        description: description,
        listName: currentList.listName,
        listId: currentList.listID,
        applicationStatus: applicationStatus,
        applicationDate: applicationDate,
      }).then((res) => {
        id = res.data.jobId;
      });

      column.items.push({
        id: id,
        companyName: company,
        position: position,
        link: link,
        applicationDate: applicationDate,
        applicationStatus: applicationStatus,
        startDate: startDate,
        description: description,
      });
      // console.log(id);
    }
  }


  function addJob() {
    const column = columns[addJobColumn];
    let company = document.getElementById("addCompany").value;
    let position = document.getElementById("addPosition").value;
    let startDate = document.getElementById("addStartDate").value;
    let link = document.getElementById("addLink").value;
    let description = document.getElementById("addDescription").value;
    let applicationStatus = column.name;
    let applicationDate = new Date().toDateString();
    let id; //= uuidv4();

    if (company === "") setCompanyValid(true);
    if (position === "") setPositionValid(true);
    if (startDate === "") setStartDateValid(true);
    if (link === "") setLinkValid(true);
    if (description === "") setDescriptionValid(true);

    if (
      company !== "" &&
      position !== "" &&
      startDate !== "" &&
      link !== "" &&
      description !== ""
    ) {
      column.count++;
      handleCloseAdd();
      console.log(currentList)
      Axios.post("http://127.0.0.1:5000/api/addJobToTrack", {
        token: localStorage.getItem("token"),
        companyName: company,
        position: position,
        startDate: startDate,
        link: link,
        description: description,
        listName: currentList.listName,
        listId: currentList.listID,
        applicationStatus: applicationStatus,
        applicationDate: applicationDate,
      }).then((res) => {
        id = res.data.jobId;
      });

      column.items.push({
        id: id,
        companyName: company,
        position: position,
        link: link,
        applicationDate: applicationDate,
        applicationStatus: applicationStatus,
        startDate: startDate,
        description: description,
      });
      console.log(id);
    }
  }

  function setColumnsData(
    wishList,
    appliedList,
    interviewList,
    offerList,
    rejectedList
  ) {
    let temp = columns;
    let temp1 = columns[1];
    temp1.items = wishList;
    temp1.count = wishList.length;
    temp[1] = temp1;
    temp1 = columns[2];
    temp1.items = appliedList;
    temp1.count = appliedList.length;
    temp[2] = temp1;
    temp1 = columns[3];
    temp1.items = interviewList;
    temp1.count = interviewList.length;
    temp[3] = temp1;
    temp1 = columns[4];
    temp1.items = offerList;
    temp1.count = offerList.length;
    temp[4] = temp1;
    temp1 = columns[5];
    temp1.items = rejectedList;
    temp1.count = rejectedList.length;
    temp[5] = temp1;
    setColumns(temp);
  }

  function deleteJob() {
    let status = modalInfo.applicationStatus;
    let column;
    console.log(modalInfo)
    if (status === "Wishlist") column = 1;
    if (status === "Applied") column = 2;
    if (status === "Interview") column = 3;
    if (status === "Offer") column = 4;
    if (status === "Rejected") column = 5;
    let theColumn = columns[column];

    theColumn.items.splice(
      theColumn.items.findIndex((item) => item.id === modalInfo.id),
      1
    );
    theColumn.count--;
    handleClose();

    console.log(currentList);

    Axios.delete("http://127.0.0.1:5000/api/removeJobFromList", {
      params: {
        token: localStorage.getItem("token"),
        listId: currentList.listID,
        jobId: modalInfo.id,
      }
    });
  }

  function addJobModal(columnId) {
    setAddJobColumn(columnId);
    setShowAdd(true);
  }

  function addList() {
    Axios.post("http://127.0.0.1:5000/api/addList", {
      token: localStorage.getItem("token"),
      listName: document.getElementById("addList").value,
    });
  }

  return (
    <Container fluid style={{ minHeight: `69.6vh`, xOverflow: `visible` }}>
      <Row style={{ marginTop: `2%` }}>
        <Col style={{ alignSelf: `center` }}>
          <Row>
            <Col>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle size="lg" className="ListSelectButton">
                  Job List
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {lists.map((element) => {
                    return (
                      <Dropdown.Item
                        onClick={() => {
                          changeList(element);
                        }}
                      >
                        {element.listName}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>{" "}
            </Col>
            <Col>
              <Form.Control id="addList" type="text" placeholder="New List" />
              <h2
                onClick={addList}
                className="ColumnHeader"
                style={{ cursor: `pointer`, width: `10px` }}
              >
                +
              </h2>
            </Col>
          </Row>
        </Col>
        <Col>
          <h1 className="TrackingHeader">{currentList.listName}</h1>
        </Col>
        <Col></Col>
      </Row>
      <Row style={{ minHeight: `60vh` }}>
        <div className="ListContainer">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div className="Column">
                  <Row>
                    <Col>
                      <h2 className="ColumnHeader">{column.name}</h2>
                    </Col>
                    <Col>
                      <h2
                        onClick={() => addJobModal(columnId)}
                        className="ColumnHeader"
                        style={{ cursor: `pointer` }}
                      >
                        +
                      </h2>
                    </Col>
                  </Row>
                  <h3 className="ColumnSubHeader">{column.count} Jobs</h3>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <Card
                                  className="JobCard"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Card.Body>
                                    <Row>
                                      <Col xs={2}>
                                        {
                                          /*Quick and dirty solution to not storing images with the job posting*/
                                          item.companyName.toLowerCase() ===
                                          "google" ? (
                                            <img
                                              style={{ marginTop: `15%` }}
                                              className="JobCardImage"
                                              src="/Assets/googleicon.png"
                                              alt=""
                                            />
                                          ) : item.companyName.toLowerCase() ===
                                            "facebook" ? (
                                            <img
                                              style={{ marginTop: `15%` }}
                                              className="JobCardImage"
                                              src="/Assets/facebookicon.png"
                                              alt=""
                                            />
                                          ) : item.companyName.toLowerCase() ===
                                            "amazon" ? (
                                            <img
                                              style={{ marginTop: `15%` }}
                                              className="JobCardImage"
                                              src="/Assets/amazonicon.png"
                                              alt=""
                                            />
                                          ) : item.companyName.toLowerCase() ===
                                            "apple" ? (
                                            <img
                                              style={{ marginTop: `15%` }}
                                              className="JobCardImage"
                                              src="/Assets/appleicon.png"
                                              alt=""
                                            />
                                          ) : item.companyName.toLowerCase() ===
                                            "netflix" ? (
                                            <img
                                              style={{ marginTop: `15%` }}
                                              className="JobCardImage"
                                              src="/Assets/netflixicon.png"
                                              alt=""
                                            />
                                          ) : item.companyName.toLowerCase() ===
                                            "tesla" ? (
                                            <img
                                              style={{ marginTop: `15%` }}
                                              className="JobCardImage"
                                              src="/Assets/teslaicon.png"
                                              alt=""
                                            />
                                          ) : item.companyName.toLowerCase() ===
                                            "twitch" ? (
                                            <img
                                              style={{ marginTop: `15%` }}
                                              className="JobCardImage"
                                              src="/Assets/twitchicon.png"
                                              alt=""
                                            />
                                          ) : item.companyName.toLowerCase() ===
                                            "microsoft" ? (
                                            <img
                                              style={{ marginTop: `15%` }}
                                              className="JobCardImage"
                                              src="/Assets/microsofticon.png"
                                              alt=""
                                            />
                                          ) : (
                                            <img
                                              style={{ marginTop: `15%` }}
                                              className="JobCardImage"
                                              src="/Assets/defaulticon.png"
                                              alt=""
                                            />
                                          )
                                        }
                                      </Col>
                                      <Col xs={10}>
                                        <Card.Title
                                          style={{ textOverflow: `ellipsis` }}
                                        >
                                          {item.position.length > 24
                                            ? item.position.substring(0, 24) +
                                              "..."
                                            : item.position}
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                          {item.companyName}
                                        </Card.Subtitle>
                                        <Row>
                                          <Col style={{ alignSelf: `start` }}>
                                            <Card.Link href={item.link}>
                                              Posting
                                            </Card.Link>
                                          </Col>
                                          <Col
                                            style={{
                                              alignSelf: `start`,
                                              textAlign: `end`,
                                            }}
                                          >
                                            <img
                                              src="Assets/expand.png"
                                              alt=""
                                              onClick={() => handleShow(item)}
                                              style={{
                                                height: `18px`,
                                                paddingRight: `15%`,
                                                margin: `0`,
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Card.Body>
                                </Card>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      </Row>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Job Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card.Title style={{ textOverflow: `ellipsis` }}>
            {modalInfo.position}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {modalInfo.companyName}
          </Card.Subtitle>
          <div style={{ textAlign: `left` }}>
            <Card.Text style={{ margin: `2% 0` }}>
              <span style={{ fontWeight: `bold` }}>Start Date:</span>{" "}
              {modalInfo.startDate}
            </Card.Text>
            <Card.Text style={{ margin: `2% 0` }}>
              <span style={{ fontWeight: `bold` }}>Application Date:</span>{" "}
              {modalInfo.applicationDate}
            </Card.Text>
            <Card.Text style={{ margin: `2% 0`, overflowWrap: `anywhere` }}>
              <span style={{ fontWeight: `bold` }}>Job Description:</span>{" "}
              {modalInfo.description}
            </Card.Text>
            <Card.Link href={modalInfo.link}>Posting</Card.Link>
          </div>
          <Button onClick={deleteJob} className="DeleteCardButton">
            Delete
          </Button>
        </Modal.Body>
      </Modal>

      <Modal centered show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card.Title style={{ textAlign: `start`, textOverflow: `ellipsis` }}>
            <Row>
              <Col xs={3}>Company</Col>
              <Col xs={9}>
                <Form.Control
                  id="addCompany"
                  type="text"
                  placeholder="Google"
                  isInvalid={addCompanyValid}
                />
              </Col>
            </Row>
          </Card.Title>
          <Card.Title style={{ textAlign: `start`, textOverflow: `ellipsis` }}>
            <Row>
              <Col xs={3}>Position</Col>
              <Col xs={9}>
                <Form.Control
                  id="addPosition"
                  type="text"
                  placeholder="SDE1"
                  isInvalid={addPositionValid}
                />
              </Col>
            </Row>
          </Card.Title>
          <Card.Title style={{ textAlign: `start`, textOverflow: `ellipsis` }}>
            <Row>
              <Col xs={3}>Start Date</Col>
              <Col xs={9}>
                <Form.Control
                  id="addStartDate"
                  type="text"
                  placeholder="May 2022"
                  isInvalid={addStartDateValid}
                />
              </Col>
            </Row>
          </Card.Title>
          <Card.Title style={{ textAlign: `start`, textOverflow: `ellipsis` }}>
            <Row>
              <Col xs={3}>Link</Col>
              <Col xs={9}>
                <Form.Control
                  id="addLink"
                  type="text"
                  placeholder="www.google.com/careers"
                  isInvalid={addLinkValid}
                />
              </Col>
            </Row>
          </Card.Title>
          <Card.Title style={{ textAlign: `start`, textOverflow: `ellipsis` }}>
            <Row>
              <Col xs={3}>Description</Col>
              <Col xs={9}>
                <Form.Control
                  id="addDescription"
                  type="text"
                  placeholder="Dream Job"
                  isInvalid={addDescriptionValid}
                />
              </Col>
            </Row>
          </Card.Title>
          <Button onClick={addJob} className="AddCardButton">
            Add
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
