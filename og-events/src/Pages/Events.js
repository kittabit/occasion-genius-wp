import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Loading from "../Components/Loading"
import Breadcrumbs from "../Components/Breadcrumbs"

class Events extends Component {

    constructor (props){

        super(props);
        this.state = {
            current_page: [],
            next_page: [],
            max_pages: [],
            events: [],
            events_url: '/wp-json/occasiongenius/v1/events?page=',
            isLoading: 1,
        }
        
    }
    
    componentDidMount() {

        Promise.all([
          fetch('/wp-json/occasiongenius/v1/events'),
        ])
        .then(([res]) => Promise.all([res.json()]))
        .then(([cat_data]) => this.setState({
          events: cat_data.events,
          current_page: cat_data.info.current_page, 
          next_page: cat_data.info.next_page, 
          max_pages: cat_data.info.max_pages, 
          isLoading: 0
        }));

        document.title = "All Local Events";

    } 

    fetchData = async (url) => {
    
        await fetch(url)
          .then((r) => r.json())
          .then((result) => {
            this.setState({
                events: result.events,
                isLoading: 0
            });
          })
          .catch((e) => {
            console.log(e);
          });
    
    };  
    
    nextPage = () => {
    
        this.setState({
            current_page: this.state.current_page + 1,
            isLoading: 1
          },
          () => {
            const events_url = this.state.events_url + this.state.current_page;
            this.fetchData(events_url);
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        );
    
    };
    
    prevPage = () => {
    
        this.setState({
            current_page: this.state.current_page - 1,
            isLoading: 1
          },
          () => {
            const events_url = this.state.events_url + this.state.current_page;
            this.fetchData(events_url);
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        );
    
    };    

    render(){

        const { current_page, next_page, max_pages } = this.state;

        return (
            <>

                <Breadcrumbs parent_title="All Categories" parent_url="/events/categories/" page_name="All Local Events" />
                
                <div className="flex items-center justify-center bg-white mb-16">                          
                    <div className="grid grid-cols-12 px-18 gap-5">

                        {this.state.isLoading ? (
                            <Loading />
                        ) : (
                            <>
                                <div className="col-span-12">
                                    <div className="flow-root">
                                        <p className="float-left text-gray-800 text-3xl font-semibold mb-0">
                                            All Local Events
                                        </p>
                                    </div>
                                </div>

                                {this.state.events.map((item, index) => (   
                                    <div className="col-span-3 bg-rose-700 rounded-xl h-52 md:h-80 no-underline" key={index}>
                                        <Link to={`/events/details/${ item.slug }`} className="no-underline">
                                            <img src={ item.image_url } alt={ item.name } className="rounded-t-xl max-h-44" />
                                            <p className="text-xl text-gray-50 pt-4 pl-3 no-underline text-ellipsis ... overflow-hidden line-clamp-2 h-20 pb-1 mb-0"> { item.name } </p>
                                            <p className="text-xs md:text-lg font-light text-gray-50 pt-0 pl-3 pb-0 mb-0 no-underline"> 
                                                { item.date_formatted } <br />
                                                { item.venue_city }, { item.venue_state }
                                            </p>
                                            <span className="text-xs md:text-lg font-light decoration-white	underline text-white text-center block mt-1 underline-offset-4">More Info</span>
                                        </Link>
                                    </div>
                                ))}
                            </>
                        )}        
                    </div> 
                </div>

                <div className="flex items-center flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 lg:space-x-8 mt-8 md:mt-16">
                    {current_page > 1 &&
                        <>
                            <button onClick={this.prevPage} className="block w-full md:w-3/5 border border-gray-800 text-base font-medium leading-none text-white uppercase py-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 bg-gray-800 hover:text-white no-underline text-center">
                                Previous Page
                            </button>
                        </>
                    }

                    {next_page < max_pages &&
                        <>
                            <button onClick={this.nextPage} className="block w-full md:w-3/5 border border-gray-800 text-base font-medium leading-none text-white uppercase py-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 bg-gray-800 hover:text-white no-underline text-center">
                                Next Page
                            </button>                    
                        </>
                    }
                </div>

            </>
        )
    }
}

export default Events