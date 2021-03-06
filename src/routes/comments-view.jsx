import React, { Component } from 'react';
import Header from '../components/header';
import Comment from '../components/comment';

export default class CommentsView extends Component{
    constructor(props){
        super(props);

        this.state = {
            id: this.props.match.params.submission,
            snoo: this.props.snoo,
            data: {}                        
        }
        this.submitComment = this.submitComment.bind(this);             
    }

    componentDidMount(){
        this.state.snoo.getSubmission(this.state.id).expandReplies({limit: 3, depth: 1}).then((response) => {            
            this.setState({
                data: response
            });
            
        });
    }
    
    shareTwitter(){
        window.open('https://twitter.com/share?url=' + document.URL, 'twitter-popup', 'height=350,width=600');
    }
    
    shareFacebook(){       
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + document.URL, 'facebook-popup', 'height=350,width=600');
    }
    
    submitComment(){
        this.state.snoo.getSubmission(this.state.id).reply(document.getElementById("textArea").value);        
        alert("Thankyou. Your comment has been posted.");
        document.getElementById("textArea").value = "";    
        
    }


    render(){
        let comments;
        let post_hint;
        if(this.state.data.hasOwnProperty('comments')){ 
            if(this.state.data.comments.length > 0){                          
                
                comments = this.state.data.comments.map((data, index) => {
                    
                    return(
                        <Comment data={data} key={data.id} index={index} snoo={this.state.snoo} />                                                
                    );
                });
                
                if(this.state.data.hasOwnProperty('post_hint')){
                    post_hint = this.state.data.post_hint;
                }else{
                    post_hint = 'NA'
                }
            }else{
                comments = <div className="no-comments">There are no comments to display.</div>;                
                if(this.state.data.hasOwnProperty('post_hint')){
                    post_hint = this.state.data.post_hint;
                }else{
                    post_hint = 'NA'
                }
            }
            
        }else{                        
            comments = <div className="no-comments">There are no comments to display.</div>;                
            if(this.state.data.hasOwnProperty('post_hint')){
                post_hint = this.state.data.post_hint;
            }else{
                post_hint = 'NA'
            }
        }
                
        return this.state.data.hasOwnProperty("comments") ? (
            <div className="comments-view-container">
                <Header />
                
                <div className="comments-header"> 
                    <img className="comments-thumbnail" src={this.state.data.thumbnail} alt="thumbnail" height={this.state.data.thumbnail_height} width={this.state.data.thumbnail_width}/>                                   
                    <div className='comments-title'><h3>{this.state.data.title}</h3></div>
                    <p className="comments-tagline">Submitted by {this.state.data.author.name}</p>
                    <div className="comments-share">
                        <ul className='list-inline'>
                            <li><i className="fa fa-twitter" aria-hidden="true" onClick={this.shareTwitter}></i></li>
                            <li><i className="fa fa-facebook" aria-hidden="true" onClick={this.shareFacebook}></i></li>                  
                        </ul>
                    </div>                    
                    <div className="clear"></div>
                    {post_hint.includes("image") && <img className="comments-preview" src={this.state.data.url} alt={this.state.data.title} />}
                    {post_hint.includes("video") && <div className="comments-preview" dangerouslySetInnerHTML={{__html: this.state.data.media_embed.content}}></div>}
                    <div className="text-field">
                        <textarea id="textArea" rows="4" cols="50" placeholder="Leave a comment" />
                        <br/><button className="submit-btn" onClick={this.submitComment}>Submit</button>                                        
                    </div>
                </div>
                
                <div className="comments-list">                    
                    {comments}
                </div>
            </div>
        ):(
            <div className="comments-loading">
                <div className="spinner"><i className="fa fa-spinner fa-spin" ></i></div>
            </div>

        )                
    }
}