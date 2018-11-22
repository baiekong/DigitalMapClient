import React, { createElement } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';

import Popover from '@material-ui/core/Popover';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { NavLink } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import classNames from 'classnames';
import { setActiveMenuListItem } from '../reducers/ui';
import * as uiRedux from '../reducers/ui';

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
    background: '#2c3747',
    '&:hover': {},
    '&$selected': {
      //background: '#2196f3'
      background: '#3f51b5'
    },
    '&$selected:hover': {
      //background: '#2196f3'
      background: '#3f51b5'
    }
  },
  selected: {
    /* Not sure why Mui have to have this for menu 'selected' status */
  },
  menuList: {
    paddingLeft: '16px'
  },
  whiteColor: {
    color: 'white'
  }
});

class MyMenuListItem extends React.Component {
  state = {
    anchorEl: null,
    open: false,
    selectedIndex: null
  };
  handleRequestClose = () => {
    this.setState({ open: false });
  };
  handleClick = e => {
    this.setState({ open: !this.state.open, anchorEl: e.currentTarget });
  };
  handleHover = e => {
    this.setState({ anchorEl: e.currentTarget });
  };
  handleListItemClick = (event, index) => {
    this.props.dispatch(
      setActiveMenuListItem({ name: this.props.listItems.itemName, idx: index })
    );
    this.setState({ selectedIndex: index });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.sidebarOpen !== nextProps.sidebarOpen) {
      this.setState({ open: false });
    }

    // Clear active selected and close sub menu if user click on other menu list
    if (nextProps.activeMenuListItem.idx !== null) {
      if (nextProps.activeMenuListItem.name !== nextProps.listItems.itemName) {
        this.setState({ open: false, selectedIndex: null });
      }
    }
  }
  render() {
    const { classes, listItems, sidebarOpen } = this.props;
    const { open, anchorEl, selectedIndex } = this.state;

    return (
      <div>
        {listItems.nestedItems === undefined ? (
          sidebarOpen === false ? (
            <Tooltip
              disableTouchListener={true}
              disableFocusListener={true}
              title={listItems.itemName}
              placement='right'
            >
              <ListItem
                className={classNames(classes.menuList)}
                button
                onClick={this.handleClick}
              >
                <ListItemIcon className={classNames(classes.whiteColor)}>
                  {createElement(listItems.itemIcon)}
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant='subtitle1'
                      className={classNames(classes.whiteColor)}
                    >
                      {listItems.itemName}
                    </Typography>
                  }
                  inset
                />
              </ListItem>
            </Tooltip>
          ) : (
            <ListItem
              className={classNames(classes.menuList)}
              button
              onClick={this.handleClick}
            >
              <ListItemIcon className={classNames(classes.whiteColor)}>
                {createElement(listItems.itemIcon)}
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    variant='subtitle1'
                    className={classNames(classes.whiteColor)}
                  >
                    {listItems.itemName}
                  </Typography>
                }
                inset
              />
            </ListItem>
          )
        ) : (
          <div>
            {sidebarOpen === false ? (
              <Tooltip
                disableTouchListener={true}
                disableFocusListener={true}
                title={listItems.itemName}
                placement='right'
              >
                <ListItem
                  className={classNames(classes.menuList)}
                  button
                  onClick={this.handleClick}
                >
                  <ListItemIcon className={classNames(classes.whiteColor)}>
                    {createElement(listItems.itemIcon)}
                  </ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        variant='subtitle1'
                        className={classNames(classes.whiteColor)}
                      >
                        {listItems.itemName}
                      </Typography>
                    }
                    inset
                  />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              </Tooltip>
            ) : (
              <ListItem
                className={classNames(classes.menuList)}
                button
                onClick={this.handleClick}
              >
                <ListItemIcon className={classNames(classes.whiteColor)}>
                  {createElement(listItems.itemIcon)}
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant='subtitle1'
                      className={classNames(classes.whiteColor)}
                    >
                      {listItems.itemName}
                    </Typography>
                  }
                  inset
                />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            )}
            <Collapse in={open && sidebarOpen} timeout='auto' unmountOnExit>
              <List component='div' disablePadding>
                {listItems.nestedItems.map((item, idx) => (
       
                    <ListItem
                      button
                      classes={{
                        root: classes.nested,
                        selected: classes.selected
                      }}
                      component={NavLink}
                      to={item.itemLink}
                      key={item.itemName}
                      selected={selectedIndex === idx}
                      onClick={event => this.handleListItemClick(event, idx)}
                    >
                      <ListItemIcon className={classNames(classes.whiteColor)}>
                        {createElement(item.itemIcon)}
                      </ListItemIcon>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            variant='subtitle1'
                            className={classNames(classes.whiteColor)}
                          >
                            {item.itemName}
                          </Typography>
                        }
                        inset
                      />
                    </ListItem>
        
                ))}
              </List>
            </Collapse>
            {!sidebarOpen && (
              <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'left'
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleRequestClose}>
                    <MenuList>
                      {listItems.nestedItems.map(item => (
                        <MenuItem
                          onClick={this.handleRequestClose}
                          component={NavLink}
                          to={item.itemLink}
                          key={item.itemName}
                        >
                          {item.itemName}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Popover>
            )}
            <Divider />
          </div>
        )}
      </div>
    );
  }
}

MyMenuListItem.propTypes = {
  listItems: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  sidebarOpen: uiRedux.getSidebarOpen(state),
  activeMenuListItem: uiRedux.getActiveMenuListItem(state)
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(MyMenuListItem))
);
