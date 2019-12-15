<template>
  <div :class="[
  'row',
  xsDirection ? 'xs-direction' + capitalize(xsDirection) : '',
  smDirection ? 'sm-direction' + capitalize(smDirection) : '',
  mdDirection ? 'md-direction' + capitalize(mdDirection) : '',
  lgDirection ? 'lg-direction' + capitalize(lgDirection) : '',
  xlDirection ? 'xl-direction' + capitalize(xlDirection) : '',
  xxlDirection ? 'xxl-direction' + capitalize(xxlDirection) : '',
  xsWrap ? 'xs-' + xsWrap : '',
  smWrap ? 'sm-' + smWrap : '',
  mdWrap ? 'md-' + mdWrap : '',
  lgWrap ? 'lg-' + lgWrap : '',
  xlWrap ? 'xl-' + xlWrap : '',
  xxlWrap ? 'xxl-' + xxlWrap : '',
  xsJustify ? 'xs-justify' + capitalize(xsJustify) : '',
  smJustify ? 'sm-justify' + capitalize(smJustify) : '',
  mdJustify ? 'md-justify' + capitalize(mdJustify) : '',
  lgJustify ? 'lg-justify' + capitalize(lgJustify) : '',
  xlJustify ? 'xl-justify' + capitalize(xlJustify) : '',
  xxlJustify ? 'xxl-justify' + capitalize(xxlJustify) : '',
  xsAlign ? 'xs-items' + capitalize(xsAlign) : '',
  smAlign ? 'sm-items' + capitalize(smAlign) : '',
  mdAlign ? 'md-items' + capitalize(mdAlign) : '',
  lgAlign ? 'lg-items' + capitalize(lgAlign) : '',
  xlAlign ? 'xl-items' + capitalize(xlAlign) : '',
  xxlAlign ? 'xxl-items' + capitalize(xxlAlign) : '',
  xsContent ? 'xs-content' + capitalize(xsContent) : '',
  smContent ? 'sm-content' + capitalize(smContent) : '',
  mdContent ? 'md-content' + capitalize(mdContent) : '',
  lgContent ? 'lg-content' + capitalize(lgContent) : '',
  xlContent ? 'xl-content' + capitalize(xlContent) : '',
  xxlContent ? 'xxl-content' + capitalize(xxlContent) : '',
  ]">
    <slot/>
  </div>
</template>

<script>
    const directionValidator = function(value) {
        return ['row', 'reverse', 'column', 'column-reverse'].indexOf(value) !== -1;
    };

    const wrapValidator = function(value) {
        return ['nowrap', 'wrap', 'wrap-reverse'].indexOf(value) !== -1;
    };

    const justifyValidator = function(value){
        return ['start', 'end', 'center', 'between', 'around', 'evenly'].indexOf(value) !== -1;
    };

    const alignValidator = function (value) {
        return ['start', 'end', 'center', 'baseline', 'stretch'].indexOf(value) !== -1;
    };

    const contentValidator = function (value) {
        return ['start', 'end', 'center', 'between', 'around', 'stretch'].indexOf(value) !== -1;
    };

    export default {
        methods: {
            capitalize: function(value) {
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        },
        props: {
            //directions
            xsDirection: {
                validator: directionValidator
            },
            smDirection: {
                validator: directionValidator
            },
            mdDirection: {
                validator: directionValidator
            },
            lgDirection: {
                validator: directionValidator
            },
            xlDirection: {
                validator: directionValidator
            },
            xxlDirection: {
                validator: directionValidator
            },
            //wraps
            xsWrap: {
                validator: wrapValidator
            },
            smWrap: {
                validator: wrapValidator
            },
            mdWrap: {
                validator: wrapValidator
            },
            lgWrap: {
                validator: wrapValidator
            },
            xlWrap: {
                validator: wrapValidator
            },
            xxlWrap: {
                validator: wrapValidator
            },
            //justify
            xsJustify: {
                validator: justifyValidator
            },
            smJustify: {
                validator: justifyValidator
            },
            mdJustify: {
                validator: justifyValidator
            },
            lgJustify: {
                validator: justifyValidator
            },
            xlJustify: {
                validator: justifyValidator
            },
            xxlJustify: {
                validator: justifyValidator
            },
            //align
            xsAlign: {
                validator: alignValidator
            },
            smAlign: {
                validator: alignValidator
            },
            mdAlign: {
                validator: alignValidator
            },
            lgAlign: {
                validator: alignValidator
            },
            xlAlign: {
                validator: alignValidator
            },
            xxlAlign: {
                validator: alignValidator
            },
            //content
            xsContent: {
                validator: contentValidator
            },
            smContent: {
                validator: contentValidator
            },
            mdContent: {
                validator: contentValidator
            },
            lgContent: {
                validator: contentValidator
            },
            xlContent: {
                validator: contentValidator
            },
            xxlContent: {
                validator: contentValidator
            },
        }
    }
</script>

<style scoped lang="scss">
  .row {
    margin-left: - $columnsSpace / 2;
    margin-right: - $columnsSpace / 2;
    display: flex;
    flex-wrap: wrap;
    &:before, &:after {
      content: normal;
    }
  }

  //make grid according to breakpoints
  @include rowInit($columns, "xs");

  @include break($screen-xs) {
    @include rowInit($columns, "sm");
  }

  @include break($screen-sm) {
    @include rowInit($columns, "md");
  }

  @include break($screen-md) {
    @include rowInit($columns, "lg");
  }

  @include break($screen-lg) {
    @include rowInit($columns, "xl");
  }

  @include break($screen-xl) {
    @include rowInit($columns, "xxl");
  }
</style>